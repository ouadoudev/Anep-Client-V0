import { useState, useEffect, useContext } from "react";
import useApiAxios from "../config/axios";
import UserContext from "../auth/user-context";
import UserProfileErrorModal from "../components/users/UserProfileErrorModal";
import MainLayout from "../layout/MainLayout";
import "bootstrap/dist/css/bootstrap.min.css";

function UserCourses() {
  const [currentUser] = useContext(UserContext);
  const [setCourses] = useState({
    enCours: [],
    terminés: [],
  });
  const [user, setUser] = useState({
    vacations: [{ start: null, end: null }],
  });
  const [submittedVacations, setSubmittedVacations] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleVacationChange = (index, field, value) => {
    setUser((prev) => {
      const updatedVacations = [...prev.vacations];
      updatedVacations[index][field] = value;
      return { ...prev, vacations: updatedVacations };
    });
  };

  const handleRemoveVacation = (index) => {
    setUser((prev) => ({
      ...prev,
      vacations: prev.vacations.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteVacation = async (vacationId, index) => {
    try {
      await useApiAxios.delete(`/users/vacations/${vacationId}`);
      console.log("Indisponibilité supprimée avec succès");
      setSubmittedVacations((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'indisponibilité:", error);
    }
  };

  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const response = await useApiAxios.get(
          `/users/${currentUser._id}/vacations`
        );
        setSubmittedVacations(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des indisponibilités:", error);
      }
    };

    fetchVacations();
  }, [currentUser._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await useApiAxios.post(`/users/vacations`, {
        userId: currentUser._id,
        vacations: user.vacations.map((vacation) => ({
          start: new Date(vacation.start).toISOString(),
          end: new Date(vacation.end).toISOString(),
        })),
      });

      console.log("Indisponibilités soumises avec succès:", response.data);
      setSubmittedVacations(response.data);
    } catch (error) {
      console.error("Erreur lors de la soumission des indisponibilités:", error);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userId = currentUser._id;
        const response = await useApiAxios.get(`/courses/user/${userId}`);
        const fetchedCourses = response.data;

        const ongoingCourses = [];
        const finishedCourses = [];

        const currentDate = new Date();

        fetchedCourses.forEach((course) => {
          if (course.times && course.times.length > 0) {
            const startDate = new Date(course.times[0].startTime);
            const endDate = new Date(course.times[0].endTime);

            if (currentDate >= startDate && currentDate <= endDate) {
              ongoingCourses.push(course);
            } else if (currentDate > endDate) {
              finishedCourses.push(course);
            }
          }
        });

        setCourses({ enCours: ongoingCourses, terminés: finishedCourses });
      } catch (error) {
        console.error("Erreur lors de la récupération des cours:", error);
      }
    };

    fetchCourses();
  }, [currentUser]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <MainLayout>
      <>
        {showModal && <UserProfileErrorModal onClose={handleCloseModal} />}
        <section>
          <div className="container-fluid-2 py-5">
            <div className="p-5 md:p-10 rounded-5 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="col-span-1 flex flex-col items-center md:items-start">
                <h5 className="text-xl leading-1.2 mb-5">Bonjour</h5>
                <h2 className="text-2xl leading-1.24 mb-5">
                  {currentUser.name}
                </h2>
                <button
                            className="relative py-2 px-4 bg-primaryColor text-white font-bold uppercase text-sm shadow-md hover:bg-primaryColor-dark transition-all duration-300"
                            onClick={handleShowModal}
                >
                  Déclarer une Erreur dans Son Profil
                </button>
              </div>
              <div className="col-span-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <UserInfoRow label="Email" value={currentUser.email} />
                <UserInfoRow label="PPR" value={currentUser.PPR} />
                <UserInfoRow label="CIN" value={currentUser.CIN} />
                <UserInfoRow
                  label="Date de naissance"
                  value={
                    currentUser.DATE_NAISSANCE &&
                    new Date(currentUser.DATE_NAISSANCE).toLocaleDateString()
                  }
                />
                <UserInfoRow label="Situation" value={currentUser.SITUATION} />
                <UserInfoRow label="Sexe" value={currentUser.SEXE} />
                <UserInfoRow
                  label="Statut familial"
                  value={currentUser.SIT_F_AG}
                />
                <UserInfoRow
                  label="Date de recrutement"
                  value={
                    currentUser.DATE_RECRUTEMENT &&
                    new Date(currentUser.DATE_RECRUTEMENT).toLocaleDateString()
                  }
                />
                <UserInfoRow
                  label="Ancienneté administrative"
                  value={
                    currentUser.ANC_ADM &&
                    new Date(currentUser.ANC_ADM).toLocaleDateString()
                  }
                />
                <UserInfoRow
                  label="Code de poste"
                  value={currentUser.COD_POS}
                />
                <UserInfoRow
                  label="Date de poste"
                  value={
                    currentUser.DAT_POS &&
                    new Date(currentUser.DAT_POS).toLocaleDateString()
                  }
                />
                <UserInfoRow
                  label="Grade de fonction"
                  value={currentUser.GRADE_fonction}
                />
                <UserInfoRow
                  label="Grade assimilé"
                  value={currentUser.GRADE_ASSIMILE}
                />
                <UserInfoRow
                  label="Date d'effet du grade"
                  value={
                    currentUser.DAT_EFF_GR &&
                    new Date(currentUser.DAT_EFF_GR).toLocaleDateString()
                  }
                />
                <UserInfoRow
                  label="Ancienneté de grade"
                  value={
                    currentUser.ANC_GRADE &&
                    new Date(currentUser.ANC_GRADE).toLocaleDateString()
                  }
                />
                <UserInfoRow label="Échelle" value={currentUser.ECHEL} />
                <UserInfoRow label="Échelon" value={currentUser.ECHELON} />
                <UserInfoRow label="Indice" value={currentUser.INDICE} />
                <UserInfoRow
                  label="Date d'effet de l'échelon"
                  value={
                    currentUser.DAT_EFF_ECHLON &&
                    new Date(currentUser.DAT_EFF_ECHLON).toLocaleDateString()
                  }
                />
                <UserInfoRow
                  label="Ancienneté d'échelon"
                  value={
                    currentUser.ANC_ECHLON &&
                    new Date(currentUser.ANC_ECHLON).toLocaleDateString()
                  }
                />
                <UserInfoRow
                  label="Affectation"
                  value={currentUser.AFFECTATION}
                />
                <UserInfoRow
                  label="Département/Division"
                  value={currentUser.DEPARTEMENT_DIVISION}
                />
                <UserInfoRow label="Service" value={currentUser.SERVICE} />
                <UserInfoRow label="Localité" value={currentUser.Localite} />
                <UserInfoRow label="Fonction" value={currentUser.FONCTION} />
                <UserInfoRow
                  label="Libellé du sous-secteur"
                  value={currentUser.LIBELLE_SST}
                />
                <UserInfoRow
                  label="Date du sous-secteur"
                  value={
                    currentUser.DAT_S_ST &&
                    new Date(currentUser.DAT_S_ST).toLocaleDateString()
                  }
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="container-fluid-2">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-30px pt-30px pb-100px">
              <div className="lg:col-start-12 lg:col-span-9">
                <div className="p-4 md:p-10 mb-8 bg-whiteColor dark:bg-whiteColor-dark shadow-lg rounded-md">
                  <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark mb-6">
                    Déclaration d'indisponibilité
                  </h2>
                  <form onSubmit={handleSubmit} className="mb-5">
                    {user.vacations.map((vacation, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row gap-4 mb-6"
                      >
                        <div className="w-full">
                          <h5 className="text-lg font-medium mb-2">
                            Indisponibilité {index + 1}
                          </h5>
                          <div className="flex flex-col md:flex-row md:items-center mb-4">
                            <label
                              htmlFor={`start-${index}`}
                              className="md:w-1/4 font-medium"
                            >
                              Date de début
                            </label>
                            <div className="w-full md:w-3/4">
                              <input
                                type="date"
                                id={`start-${index}`}
                                className="form-input mt-1 block w-full"
                                value={vacation.start || ""}
                                onChange={(e) =>
                                  handleVacationChange(
                                    index,
                                    "start",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center mb-4">
                            <label
                              htmlFor={`end-${index}`}
                              className="md:w-1/4 font-medium"
                            >
                              Date de fin
                            </label>
                            <div className="w-full md:w-3/4">
                              <input
                                type="date"
                                id={`end-${index}`}
                                className="form-input mt-1 block w-full"
                                value={vacation.end || ""}
                                onChange={(e) =>
                                  handleVacationChange(
                                    index,
                                    "end",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            className="relative mr-5 py-2 px-4 btn btn-danger text-white font-bold uppercase text-sm shadow-md  hover:bg-primaryColor-dark transition-all duration-300"
                            onClick={() => handleRemoveVacation(index)}
                          >
                            Supprimer l'indisponibilité
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between space-x-4">
                      <button
                        type="submit"
                        className="relative py-3 px-4 bg-primaryColor text-white font-bold uppercase text-sm shadow-md  hover:bg-primaryColor-dark transition-all duration-300"
                      >
                        Soumettre les indisponibilités
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setUser((prev) => ({
                            ...prev,
                            vacations: [
                              ...prev.vacations,
                              { start: "", end: "" },
                            ],
                          }))
                        }
                        className="relative mr-5 py-3 px-4 bg-primaryColor text-white font-bold uppercase text-sm shadow-md  hover:bg-primaryColor-dark transition-all duration-300"
                      >
                        Ajouter une indisponibilité
                      </button>
                    </div>
                  </form>
                  <h3 className="text-xl font-bold">
                    Indisponibilités soumises
                  </h3>
                  {submittedVacations.length > 0 ? (
                    <ul className="mt-4">
                      {submittedVacations.map((vacation, index) => (
                        <li
                          key={vacation._id}
                          className="flex items-center justify-between mb-2"
                        >
                          <span>
                            {new Date(vacation.start).toLocaleDateString()} -{" "}
                            {new Date(vacation.end).toLocaleDateString()}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteVacation(vacation._id, index)
                            }
                            className="relative py-2 px-4 bg-primaryColor text-white font-bold uppercase text-sm shadow-md hover:bg-primaryColor-dark transition-all duration-300"
                          >
                            Supprimer
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">Aucune indisponibilité soumise.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </MainLayout>
  );
}

export default UserCourses;

function UserInfoRow({ label, value }) {
  return (
    <div className="flex justify-between p-4 bg-white dark:bg-whiteColor-dark border-b border-borderColor dark:border-borderColor-dark">
      <span className="font-semibold text-blackColor dark:text-blackColor-dark">
        {label} :
      </span>
      <span className="text-blackColor dark:text-blackColor-dark">{value}</span>
    </div>
  );
}
