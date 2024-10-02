import { useState, useContext } from "react";
import useApiAxios from "../../config/axios";
import UserContext from "../../auth/user-context";

const UserProfileErrorModal = ({ onClose }) => {
  const [currentUser] = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await useApiAxios.post(
        "/user-profile-errors",
        {
          user: currentUser,
          title: title,
          message: message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Success:", response.data);
      setSubmitStatus("success");
      setTitle("");
      setMessage("");
      onClose(); // Close the popup after successful submission
    } catch (error) {
      console.error("Error:", error);
      setSubmitStatus("error");
      onClose(); // Close the popup even if there is an error
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="popup-close" onClick={onClose}>
          X
        </button>
        <div className="form-container">
          {submitStatus === "success" && (
            <div className="flash-message success">
              Votre erreur a été envoyée avec succès.
            </div>
          )}
          {submitStatus === "error" && (
            <div className="flash-message error">
              Une erreur s'est produite lors de l'envoi de l'erreur.
            </div>
          )}
          <form onSubmit={handleFormSubmit} className="error-form">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'erreur"
              required
              className="form-input title-input"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Décrivez l'erreur"
              required
              className="form-input message-textarea"
            />
            <div className="form-buttons">
              <button type="submit" className="submit-button">
                Envoyer
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setTitle("");
                  setMessage("");
                  onClose();
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfileErrorModal;
