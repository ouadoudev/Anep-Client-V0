import { useState, useEffect } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import dragDataPlugin from "chartjs-plugin-dragdata";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import useApiAxios from "../../config/axios";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  dragDataPlugin
);

const RadarChart = ({ courseId, userId }) => {
  const [evaluationData, setEvaluationData] = useState(() => {
    const savedData = localStorage.getItem("evaluationData");
    return savedData ? JSON.parse(savedData) : [3, 6, 3, 6, 3, 6, 3, 6];
  });

  const [comments, setComments] = useState("");
  const [aspectsToImprove, setAspectsToImprove] = useState("");
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    localStorage.setItem("evaluationData", JSON.stringify(evaluationData));
  }, [evaluationData]);

  useEffect(() => {
    // Fetch course data based on courseId
    const fetchCourseData = async () => {
      try {
        const response = await useApiAxios.get(`/courses/${courseId}`);
        if (response.status === 200) {
          setCourseData(response.data);
        } else {
          console.error("Failed to fetch course data");
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const evaluation = {
      userId: userId,
      evaluationData: data.labels.map((label, index) => ({
        name: label,
        value: evaluationData[index],
      })),
      comments,
      aspectsToImprove,
    };

    // Debugging: Log the evaluation object to verify all fields are populated
    console.log("Submitting evaluation:", evaluation);

    try {
      const response = await useApiAxios.post(
        `/evaluations/${courseId}/`,
        evaluation
      );

      if (response.status === 201) {
        alert("Evaluation submitted successfully!");
      } else {
        alert("Failed to submit evaluation.");
      }
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      alert("An error occurred while submitting the evaluation.");
    }
  };

  const data = {
    labels: [
      "Apports d'informations",
      "Conception de la démarche",
      "Qualité de l'animation",
      "Conditions matérielles",
      "Adaptation aux tâches professionnelles",
      "Motivation à me perfectionner dans le domaine",
      "Réponse aux attentes",
      "Implication des participants",
    ],
    datasets: [
      {
        label: "Évaluation",
        data: evaluationData,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: 7,
        ticks: {
          backdropColor: "transparent",
          stepSize: 1,
          color: "#666",
        },
        pointLabels: {
          font: {
            size: 16,
            family: "Helvetica, Arial, sans-serif",
          },
          color: "#333",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          padding: 20,
          boxWidth: 15,
          color: "#4A4A4A",
          font: {
            size: 14,
            family: "Helvetica, Arial, sans-serif",
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0,0,0,0.7)",
        bodyColor: "#fff",
        bodyFont: {
          size: 14,
        },
        displayColors: false,
        bodySpacing: 5,
        padding: 10,
      },
      dragData: {
        round: 1,
        showTooltip: true,
        onDragStart: (e) => {
          e.target.style.borderWidth = "2";
        },
        onDrag: (index, value) => {
          setEvaluationData((currentData) => {
            const updatedData = [...currentData];
            updatedData[index] = Math.round(value);
            return updatedData;
          });
        },
        onDragEnd: (e) => {
          e.target.style.backgroundColor = "";
          e.target.style.borderColor = "";
          e.target.style.borderWidth = "";
        },
      },
    },
  };

  // Get today's date
  const today = new Date().toLocaleDateString("fr-CA");

  return (
    <div className="container evaluation-form hna">
      <header className="text-center my-4">
        <h1>AGENCE NATIONALE DES EQUIPEMENTS PUBLICS</h1>
        <h2>Fiche d&apos;évaluation à chaud de la formation</h2>
      </header>

      <section className="info-section my-4">
        <div className="row mb-2">
          <div className="col-md-4 font-weight-bold">Date:</div>
          <div className="col-md-8">{today}</div>
        </div>
        <div className="row mb-2">
          <div className="col-md-4 font-weight-bold">
            Thème de la formation:
          </div>
          <div className="col-md-8">
            {courseData ? courseData.offline : "Loading..."}
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-4 font-weight-bold">Nom des formateurs:</div>
          {courseData &&
            courseData.times?.map((session, index) => (
              <div key={index} className="col-md-8">
                {session.instructor && session.instructor.name
                  ? session.instructor.name
                  : "Instructor name not available"}
              </div>
            ))}
        </div>
      </section>

      <p className="instructions my-4">
        Vous encadrerez le chiffre correspondant à votre évaluation sur
        l&apos;échelle de 1 à 2 (pas du tout satisfait), de 3 à 4 (moyennement
        satisfaisant), de 5 à 7 (tout à fait satisfait)
      </p>

      <div className="chart-container mb-4">
        <Radar data={data} options={options} />
      </div>

      <form onSubmit={handleSubmit}>
        <section className="comments-section my-4">
          <h2>1. Vos commentaires :</h2>
          <textarea
            className="form-control mb-3"
            rows="3"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          ></textarea>

          <h2>2. Aspects de la formation que vous aimeriez approfondir :</h2>
          <textarea
            className="form-control mb-3"
            rows="3"
            value={aspectsToImprove}
            onChange={(e) => setAspectsToImprove(e.target.value)}
          ></textarea>
        </section>
        <button type="submit" className="btn btn-primary">
          Soumettre l&apos;évaluation
        </button>
      </form>
    </div>
  );
};
RadarChart.propTypes = {
  courseId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};
export default RadarChart;
