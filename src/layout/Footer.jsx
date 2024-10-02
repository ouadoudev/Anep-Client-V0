function Footer() {
  return (
      <footer className="bg-darkblack">
        <div className="container pt-65px pb-5 lg:pb-10">
          {/* droits d'auteur du pied de page  */}
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-30px pt-10 items-center">
              <div className="lg:col-start-1 lg:col-span-3">
                <a href="#">
                  <img loading="lazy" src="/assets/images/logo/logo_2.png" alt="" />
                </a>
              </div>
              <div className="lg:col-start-4 lg:col-span-6">
                <p className="text-whiteColor">
                © Droits d'auteur  <span className="text-primaryColor">2024 </span>{" "}
                  par ANEP. Tous droits réservés.
                </p>
              </div>
              <div className="lg:col-start-10 lg:col-span-3">
                <ul className="flex gap-3 lg:gap-2 2xl:gap-3 lg:justify-end">
                  <li>
                    <a
                      href="#"
                      className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-whiteColor bg-opacity-10 hover:bg-primaryColor text-center"
                    >
                      <i className="icofont-facebook" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-whiteColor bg-opacity-10 hover:bg-primaryColor text-center"
                    >
                      <i className="icofont-twitter" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-whiteColor bg-opacity-10 hover:bg-primaryColor text-center"
                    >
                      <i className="icofont-vimeo" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-whiteColor bg-opacity-10 hover:bg-primaryColor text-center"
                    >
                      <i className="icofont-linkedin" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-whiteColor bg-opacity-10 hover:bg-primaryColor text-center"
                    >
                      <i className="icofont-skype" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  
}

export default Footer;
