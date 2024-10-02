import { useState } from 'react';
import useApiAxios from "../config/axios";
function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    const handleForgetPassword = (event) => {
        event.preventDefault();
        let formErrors = {};

        if (!email) {
            formErrors.email = "Email est requis";
        } else if (!validateEmail(email)) {
            formErrors.email = "Email n'est pas valide";
        }

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setErrors({});
        
        //Appel à l'API pour oublier le mot de passe
        useApiAxios.post("auth/forgetpassword", { email })
            .then((response) => {
                console.log(response.data.message);
                alert(response.data.message);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <>
            {/* section du formulaire */}
            <section className="relative">
                <div className="container py-100px">
                    <div className="md:w-2/3 mx-auto">
                        {/* conteneur du formulaire */}
                        <div className="shadow-container bg-whiteColor dark:bg-whiteColor-dark pt-10px px-5 pb-10 md:p-50px md:pt-30px rounded-5px">
                            {/* formulaire de nouveau mot de passe */}
                            <div className="block opacity-100 transition-opacity duration-150 ease-linear">
                                {/* en-tête */}
                                <div className="text-center">
                                    <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal">
                                        Email
                                    </h3>
                                </div>
                                <form className="pt-25px" onSubmit={handleForgetPassword}>
                                    <div className="grid grid-cols-1 lg:grid-cols-1 lg:gap-x-30px gap-y-25px mb-25px">
                                        <div>
                                            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                onChange={handleEmailChange}
                                                value={email}
                                                placeholder="Entrez votre email"
                                                className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-xs italic mt-2">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-25px text-center">
                                        <button
                                            type="submit"
                                            className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                                        >
                                            Soumettre
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ForgetPassword;
