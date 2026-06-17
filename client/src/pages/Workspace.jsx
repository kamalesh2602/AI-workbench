import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getWorkspace, getWorkspaceDocuments, uploadDocument, deleteDocument, } from "../services/workspaceService";
import { askQuestion, getChatHistory } from "../services/chatService";
import { processDocument, embedDocument, generateSummary } from "../services/documentService";
import "../styles/workspace.css";
import { getDocumentUrl } from "../services/documentService";


function Workspace() {
  const { id } = useParams();

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [sources, setSources] = useState([]);
  const [expandedSummary, setExpandedSummary] = useState(null);

  useEffect(() => {
    loadWorkspace();
    loadDocuments();
    loadChatHistory();
  }, [id]);

  const loadWorkspace = async () => {
    try {
      const data = await getWorkspace(id);
      setWorkspace(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const data = await getWorkspaceDocuments(id);
      setDocuments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadChatHistory = async () => {
    try {
      const data = await getChatHistory(id);
      setChatHistory(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);

      const document = await uploadDocument(
        id,
        selectedFile
      );

      await processDocument(document.id);

      await embedDocument(document.id);
      await generateSummary(document.id);

      await loadDocuments();

      setSelectedFile(null);

    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (
    documentId
  ) => {

    const confirmed =
      window.confirm(
        "Delete this document?"
      );

    if (!confirmed) return;

    try {
      await deleteDocument(documentId);
      loadDocuments();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAsk = async (
    customQuestion = null
  ) => {

    const query =
      customQuestion || question;

    if (!query.trim()) return;

    try {

      setAsking(true);

      const data =
        await askQuestion(
          id,
          query
        );

      setAnswer(data.answer);
      setQuestion("");

      setSources(data.sources);

      await loadChatHistory();

    } catch (error) {

      console.error(error);

    } finally {

      setAsking(false);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!workspace) {
    return <h2>Workspace not found</h2>;
  }

  return (
    <div className="workspace-container">

      <div className="workspace-header">
        <h1>{workspace.name}</h1>

        <p>
          {workspace.description ||
            "No description available"}
        </p>
      </div>

      <div className="workspace-grid">

        {/* LEFT PANEL */}

        <div className="documents-panel">

          <h2>Documents</h2>

          <div className="upload-section">

            <input
              type="file"
              onChange={(e) =>
                setSelectedFile(
                  e.target.files[0]
                )
              }
            />

            <button
              onClick={handleUpload}
              disabled={uploading}
            >
              {
                uploading
                  ? "Processing..."
                  : "Upload PDF"
              }
            </button>

          </div>

          {documents.length === 0 ? (
            <p>
              Upload a PDF to start chatting with your documents.
            </p>
          ) : (
            documents.map((doc) => (
              <div
                key={doc._id}
                className="document-card"
              >

                {/* HEADER */}

                <div className="document-header">
                  <p>{doc.filename}</p>
                </div>

                {/* ACTIONS */}

                <div className="document-actions">

                  <button
                    onClick={() =>
                      setExpandedSummary(
                        expandedSummary === doc._id
                          ? null
                          : doc._id
                      )
                    }
                  >
                    {
                      expandedSummary === doc._id
                        ? "Hide Summary"
                        : "Show Summary"
                    }
                  </button>

                  <a
                    href={getDocumentUrl(doc._id)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View PDF
                  </a>

                  <button
                    onClick={() =>
                      handleDeleteDocument(
                        doc._id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

                {/* SUMMARY */}

                {
                  expandedSummary === doc._id &&
                  doc.summary && (
                    <div className="summary-box">
                      <pre className="summary-text">
                        {doc.summary}
                      </pre>
                    </div>
                  )
                }

                {/* SUGGESTED QUESTIONS */}

                {
                  doc.suggested_questions?.length > 0 && (
                    <div className="suggested-questions">

                      <h4>
                        Suggested Questions
                      </h4>

                      {
                        doc.suggested_questions.map(
                          (q, index) => (
                            <button
                              key={index}
                              className="question-chip"
                              onClick={() =>
                                handleAsk(q)
                              }
                            >
                              {q}
                            </button>
                          )
                        )
                      }

                    </div>
                  )
                }

              </div>
            ))
          )}

        </div>

        {/* RIGHT PANEL */}

        <div className="chat-panel">

          <h2>AI Assistant</h2>

          <div className="ask-section">

            <input
              type="text"
              value={question}
              onChange={(e) =>
                setQuestion(
                  e.target.value
                )
              }
              placeholder="Ask about your documents..."
            />

            <button
              onClick={handleAsk}
              disabled={asking}
            >
              {
                asking
                  ? "Thinking..."
                  : "Ask"
              }
            </button>

          </div>

          {answer && (

            <div className="answer-card">

              <h3>Latest Answer</h3>

              <p>{answer}</p>

            </div>

          )}
          {sources.length > 0 && (

            <div className="sources-card">

              <h3>Sources Used</h3>

              {sources.map((source, index) => (

                <div
                  key={index}
                  className="source-card"
                >
                  📄 {source.filename}
                </div>

              ))}

            </div>

          )}

          <h3>Chat History</h3>

          {chatHistory.length === 0 ? (
            <p>Ask your first question.</p>
          ) : (
            chatHistory.map((chat) => (

              <div
                key={chat._id}
                className="chat-card"
              >

                <p>
                  <strong>You:</strong>
                  {" "}
                  {chat.question}
                </p>

                <p>
                  <strong>AI:</strong>
                  {" "}
                  {chat.answer}
                </p>

              </div>

            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default Workspace;