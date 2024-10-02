import Navbar from "./Navbar";
function Header() {
  return (
    <header>
      {/* début de l'en-tête */}
      <div className="bg-primaryColor dark:bg-lightGrey10-dark hidden lg:block">
        <div className="container 3xl:container-secondary-lg 4xl:container mx-auto text-whiteColor text-size-12 xl:text-sm py-5px xl:py-9px">
          <div className="flex justify-between items-center">
            <div className="flex  items-center">
            <i class="icofont-phone  text-size-15 mr-5px"></i>
              <p>Appelez-nous : 0771000605 </p>
            </div>
            <div className="flex     items-center">
            <i class="icofont-ui-email  text-size-15 mr-5px"></i>
              <p>Envoyez-nous un e-mail : formation.continue@anep.ma</p>
            </div>
            <div className="flex gap-37px items-center">
              <div>
                <p>
                  <i className="icofont-location-pin  text-size-15 mr-5px" />
                  <span>Rue Bani Abid, Av Mohamed Ben Hassan Alouazzani, Rabat.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* fin de l'en-tête */}
      <Navbar />
    </header>
  );
}
export default Header;
