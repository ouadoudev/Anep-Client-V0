import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useApiAxios from '../config/axios';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user, setUser] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const { id } = useParams();

    useEffect(() => {
        resetTokenVerify(id);
    }, [id]);

    const resetTokenVerify = (id) => {
        useApiAxios
            .get(`auth/resetTokenVerification/${id}`)
            .then(response => {
                setUser(response.data.user);
            })
            .catch(error => {
                console.error(error);
                window.location.href = '/auth';
            });
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordError('');
        if (e.target.value.length < 8) {
            setPasswordError('Le mot de passe doit comporter au moins 8 caractères');
        }
        if (e.target.value !== confirmPassword) {
            setConfirmPasswordError('Les mots de passe ne correspondent pas');
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setConfirmPasswordError('');
        if (password !== e.target.value) {
            setConfirmPasswordError('Les mots de passe ne correspondent pas');
        } else {
            setConfirmPasswordError('');
        }
    };

    const validateForm = () => {
        let valid = true;
        if (password.length < 8) {
            setPasswordError('Le mot de passe doit comporter au moins 8 caractères');
            valid = false;
        }
        if (password !== confirmPassword) {
            setConfirmPasswordError('Les mots de passe ne correspondent pas');
            valid = false;
        }
        return valid;
    };

    const handleNewPassword = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const email = user.email;
            const passwordValue = password;
            useApiAxios
                .post('auth/newpassword', { email, password: passwordValue })
                .then(res => {
                    window.location.href = '/auth';
                })
                .catch(error => {
                    console.error(error);
                    alert(error.response.data.error)
                });
        }
    };

    return (
        <>
            {/* section bannière */}
            <section>
                {/* section bannière */}
                <div className="bg-lightGrey10 dark:bg-lightGrey10-dark relative z-0 overflow-y-visible py-50px md:py-20 lg:py-100px 2xl:pb-150px 2xl:pt-40.5">
                    {/* icônes animés */}
                    <div>
                        <img
                            className="absolute left-0 bottom-0 md:left-[14px] lg:left-[50px] lg:bottom-[21px] 2xl:left-[165px] 2xl:bottom-[60px] animate-move-var z-10"
                            src="assets/images/herobanner/herobanner__1.png"
                            alt=""
                        />
                        <img
                            className="absolute left-0 top-0 lg:left-[50px] lg:top-[100px] animate-spin-slow"
                            src="assets/images/herobanner/herobanner__2.png"
                            alt=""
                        />
                        <img
                            className="absolute right-[30px] top-0 md:right-10 lg:right-[575px] 2xl:top-20 animate-move-var2 opacity-50 hidden md:block"
                            src="assets/images/herobanner/herobanner__3.png"
                            alt=""
                        />
                        <img
                            className="absolute right-[30px] top-[212px] md:right-10 md:top-[157px] lg:right-[45px] lg:top-[100px] animate-move-hor"
                            src="assets/images/herobanner/herobanner__5.png"
                            alt=""
                        />
                    </div>
                    <div className="container">
                        <div className="text-center">
                            <h1 className="text-3xl md:text-size-40 2xl:text-size-55 font-bold text-blackColor dark:text-blackColor-dark mb-7 md:mb-6 pt-3">
                                {user.name}, définissez votre mot de passe
                            </h1>
                            <ul className="flex gap-1 justify-center">
                                <li>
                                    <a
                                        href="index.html"
                                        className="text-lg text-blackColor2 dark:text-blackColor2-dark"
                                    >
                                        Accueil <i className="icofont-simple-right" />
                                    </a>
                                </li>
                                <li>
                                    <span className="text-lg text-blackColor2 dark:text-blackColor2-dark">
                                        Définir un nouveau mot de passe
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            {/* section formulaire */}
            <section className="relative">
                <div className="container py-100px">
                    <div className="md:w-2/3 mx-auto">
                        {/* conteneur de formulaire */}
                        <div className="shadow-container bg-whiteColor dark:bg-whiteColor-dark pt-10px px-5 pb-10 md:p-50px md:pt-30px rounded-5px">
                            {/* formulaire de nouveau mot de passe */}
                            <div className="block opacity-100 transition-opacity duration-150 ease-linear">
                                {/* en-tête */}
                                <div className="text-center">
                                    <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal">
                                        Nouveau mot de passe
                                    </h3>
                                </div>
                                <form className="pt-25px" data-aos="fade-up" onSubmit={handleNewPassword}>
                                    <div className="grid grid-cols-1 lg:grid-cols-1 lg:gap-x-30px gap-y-25px mb-25px">
                                        <div>
                                            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                                                Nouveau mot de passe
                                            </label>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={handlePasswordChange}
                                                placeholder="Nouveau mot de passe"
                                                className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                                            />
                                            {passwordError && (
                                                <p className="error-message text-sm mt-2">{passwordError}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                                                Confirmer le nouveau mot de passe
                                            </label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={handleConfirmPasswordChange}
                                                placeholder="Confirmer le nouveau mot de passe"
                                                className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                                            />
                                            {confirmPasswordError && (
                                                <p className="error-message text-sm mt-2">{confirmPasswordError}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-25px text-center">
                                        <button
                                            type="submit"
                                            className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                                        >
                                            Définir le nouveau mot de passe
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

export default ResetPassword;
