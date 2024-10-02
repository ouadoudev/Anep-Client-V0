import MainLayout from "../layout/MainLayout";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useApiAxios from "../config/axios";
import CountUp from "react-countup";

function HomePage() {
  const [cards, setCards] = useState([]);
  const [statistics, setStatistics] = useState({
    totalCourses: 0,
    offline: 0,
    online: 0,
    hybrid: 0
  });

  const baseURL = "https://anep-server.onrender.com";

  // Effectuer une requête pour récupérer les cours
  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await useApiAxios.get(`/courses?hidden=visible`);
        const data = response.data;
        const sortedCourses = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);

        setCards(sortedCourses);
      } catch (error) {
        console.error("Échec de la récupération des cours :", error);
      }
    }

    fetchCards();
  }, []);

  // Effectuer une requête pour récupérer les statistiques
  useEffect(() => {
    async function fetchStatistics() {
      try {
        const response = await useApiAxios.get(`/courses/statistics`);
        const data = response.data;
        setStatistics(data);
      } catch (error) {
        console.error("Échec de la récupération des statistiques :", error);
      }
    }

    fetchStatistics();
  }, []);

  return (
    <MainLayout>
      <>
        <>
          {/* Section de la bannière */}
          <section>
            <>
              <div className="hero bg-lightGrey11 relative z-0 overflow-hidden py-50px">
                <div className="container 2xl:container-secondary-md relative">
                  <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-30px">
                    {/* Partie gauche de la bannière */}
                    <div
                      data-aos="fade-up"
                      className="md:col-start-1 md:col-span-12 lg:col-start-1 lg:col-span-8"
                    >
                      <div className="3xl:pr-135px">
                        <h3 className="uppercase text-secondaryColor text-size-15 mb-5px md:mb-15px font-inter tracking-[4px] font-semibold">
                          ANEP E-FORMATION
                        </h3>
                        <h1 className="text-size-35 md:text-size-65 lg:text-5xl 2xl:text-size-65 leading-42px md:leading-18 lg:leading-15 2xl:leading-18 text-whiteColor md:tracking-half lg:tracking-normal 2xl:tracking-half font-bold mb-15px">
                          C'est ce que nous pensons déjà{" "}
                          <span className="text-secondaryColor">connaître</span>{" "}
                          qui nous empêche souvent{" "}
                          <span className="text-secondaryColor"> d'apprendre</span>.
                        </h1>
                        <p className="text-size-15 md:text-lg text-whiteColor font-medium">
                          Claude Bernard
                        </p>
                        <div className="mt-30px">
                          <Link
                            to="/courses"
                            className="text-sm md:text-size-15 text-whiteColor bg-primaryColor border border-primaryColor px-25px py-15px hover:text-primaryColor hover:bg-whiteColor rounded inline-block mr-6px md:mr-30px"
                          >
                            Voir les cours
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* Partie droite de la bannière */}
                  </div>
                </div>
              </div>
            </>
          </section>
          {/* Section des cours */}
          <section>
            <div className="pt-50px pb-10 md:pt-70px md:pb-50px lg:pt-20 2xl:pt-100px 2xl:pb-70px bg-whiteColor">
              <div className="filter-container container">
                <div className="flex gap-15px lg:gap-30px flex-wrap lg:flex-nowrap items-center">
                  {/* Partie gauche des cours */}
                  <div
                    className="basis-full lg:basis-[500px]"
                    data-aos="fade-up"
                  >
                    <span className="text-sm font-semibold text-primaryColor bg-whitegrey3 px-6 py-5px mb-5 rounded-full inline-block">
                      Liste des cours
                    </span>
                    <h3
                      className="text-3xl md:text-[35px] lg:text-size-42 leading-[45px] 2xl:leading-[45px] md:leading-[50px] font-bold text-blackColor"
                      data-aos="fade-up"
                    >
                      Derniers cours ajoutés
                    </h3>
                  </div>
                  {/* Partie droite des cours */}
                </div>
                {/* Cartes de cours */}
                <div
                  className="container p-0 filter-contents flex flex-wrap sm:-mx-15px mt-7 lg:mt-10"
                  data-aos="fade-up"
                >
                  {cards.length > 0 ? (
                    cards.map((card) => (
                      <div
                        key={card.id}
                        className="w-full sm:w-1/2 lg:w-1/3 group grid-item"
                      >
                        <div className="tab-content-wrapper sm:px-15px mb-30px">
                          <div className="p-15px bg-whiteColor shadow-brand">
                            {/* Image de la carte */}
                            <div className="relative mb-4">
                              <Link
                                to={`/CoursesDetails/${card._id}`}
                                className="w-full overflow-hidden rounded"
                              >
                                <img
                                  src={`${baseURL}${card.imageUrl}`}
                                  alt={card.title || "Image du cours"}
                                  className="w-full transition-all duration-300 group-hover:scale-110"
                                />
                              </Link>
                              <div className="absolute left-0 top-1 flex justify-between w-full items-center px-2">
                                <Link
                                  className="text-white bg-black bg-opacity-15 rounded hover:bg-primaryColor"
                                  to="#"
                                >
                                  <i className="icofont-heart-alt text-base py-1 px-2" />
                                </Link>
                              </div>
                            </div>
                            {/* Contenu de la carte */}
                            <div>
                              <Link
                                to={`/CoursesDetails/${card._id}`}
                                className="text-xl font-semibold text-blackColor mb-10px font-hind hover:text-primaryColor"
                              >
                                {card.title}
                              </Link>
                              {/* Auteur et notation */}
                              <div className="grid grid-cols-1 md:grid-cols-2 pt-15px border-t border-borderColor">
                                <div>
                                  <Link
                                    to="#"
                                    className="text-sm font-inter mb-4 description-clamp text-blackColor"
                                  >
                                    <span className="flex">
                                      <p>
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: card.description,
                                          }}
                                        />
                                      </p>
                                    </span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>Aucune carte disponible.</div>
                  )}
                </div>
              </div>
            </div>
          </section>
                {/* Section des statistiques */}
                <section className="py-10 md:py-20 lg:py-50 bg-lightGrey">
          <div className="container">
            <h2 className="text-3xl font-bold mb-6 md:mb-10">Statistiques du site</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10">
              <div className="bg-white p-6 md:p-8 shadow-md rounded-lg text-center">
                <h3 className="text-xl md:text-2xl font-semibold text-primaryColor mb-2">Total de cours</h3>
                <CountUp
                  start={0}
                  end={statistics.totalCourses}
                  duration={2.5}
                  separator=","
                >
                  {({ countUpRef }) => (
                    <div className="text-2xl md:text-3xl font-bold text-blackColor" ref={countUpRef} />
                  )}
                </CountUp>
              </div>
              <div className="bg-white p-6 md:p-8 shadow-md rounded-lg text-center">
                <h3 className="text-xl md:text-2xl font-semibold text-primaryColor mb-2">Formation en ligne</h3>
                <CountUp
                  start={0}
                  end={statistics.online}
                  duration={2.5}
                  separator=","
                >
                  {({ countUpRef }) => (
                    <div className="text-2xl md:text-3xl font-bold text-blackColor" ref={countUpRef} />
                  )}
                </CountUp>
              </div>
              <div className="bg-white p-6 md:p-8 shadow-md rounded-lg text-center">
                <h3 className="text-xl md:text-2xl font-semibold text-primaryColor mb-2">Formation Présentiel</h3>
                <CountUp
                  start={0}
                  end={statistics.offline}
                  duration={2.5}
                  separator=","
                >
                  {({ countUpRef }) => (
                    <div className="text-2xl md:text-3xl font-bold text-blackColor" ref={countUpRef} />
                  )}
                </CountUp>
              </div>
              <div className="bg-white p-6 md:p-8 shadow-md rounded-lg text-center">
                <h3 className="text-xl md:text-2xl font-semibold text-primaryColor mb-2">Formation hybrides</h3>
                <CountUp
                  start={0}
                  end={statistics.hybrid}
                  duration={2.5}
                  separator=","
                >
                  {({ countUpRef }) => (
                    <div className="text-2xl md:text-3xl font-bold text-blackColor" ref={countUpRef} />
                  )}
                </CountUp>
              </div>
            </div>
          </div>
        </section>
        </>
      </>
    </MainLayout>
  );
}

export default HomePage;
