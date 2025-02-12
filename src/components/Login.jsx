import React, { useContext, useState } from "react";
import logo from "../assets/logo-removebg-preview.png";
import { useNavigate } from "react-router-dom";
import { setDoc, doc, getFirestore, getDoc } from "firebase/firestore";

import {
  db,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "../firebase/firebase";
import { FirebaseContext } from "../firebase";
import { typeRole } from "../utils";
const firestore = getFirestore();

const Login = () => {
  const [registering, setRegistering] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();
  const { token } = useContext(FirebaseContext);
  const savedOrders = localStorage.getItem("savedOrders");
  const uidRestaurantLocalStorage = localStorage.getItem("uidRestaurant");
  const uidRestaurant = JSON.parse(uidRestaurantLocalStorage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, name, phone } = e.target;

    if (registering) {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        setError(undefined);
        const user = auth.currentUser;
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc && userDoc.exists()) {
          const userData = userDoc.data();
          const userRole = userData.role;

          // Redirección basada en el rol del usuario
          if (userRole === typeRole.admin) {
            navigate("/admin");
          } else if (userRole === typeRole.cashier) {
            navigate("/cashier");
          } else if (userRole === typeRole.chef) {
            // Guardar o actualizar el token si el usuario es un cocinero
            await setDoc(userDocRef, { token: token, ...userDoc.data() });
            navigate("/chef");
          } else {
            // Guardar o actualizar el token si el usuario si es un cliente
            await setDoc(userDocRef, { token: token, ...userDoc.data() });

            // Si existe guardada savedOrders en el localStorage rediccionar al Restaurante directamente
            // const savedOrders = localStorage.getItem("savedOrders");
            // const uidRestaurantLocalStorage =
            //   localStorage.getItem("uidRestaurant");
            // const uidRestaurant = JSON.parse(uidRestaurantLocalStorage);
            savedOrders
              ? navigate(`/restaurant/${uidRestaurant}`)
              : navigate("/home");
          }
        } else {
          console.log("no entra");
        }
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          setError("Error: El usuario es incorrecto");
        } else if (error.code === "auth/wrong-password") {
          setError("Error: La contraseña es incorrecta");
        } else {
          setError(error.message);
          console.error("Error:", error.message);
        }
      }
    } else {
      try {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value,
        );
        const userData = {
          email: email.value,
          name: name.value,
          phone: phone.value,
          token,
          uidUser: user.uid,
        };
        const userRef = doc(db, "users", user.uid);
        //obtener token y almacenarlo en la bd con el usuario
        await setDoc(userRef, userData);
        setError(undefined);
        // Si existe guardada savedOrders en el localStorage rediccionar al Restaurante directamente
        savedOrders
          ? navigate(`/restaurant/${uidRestaurant}`)
          : navigate("/home");
      } catch (error) {
        if (error.code === "auth/weak-password") {
          setError(
            "Error: La contraseña es demasiado débil. Debe tener al menos 6 caracteres.",
          );
        } else if (error.code === "auth/email-already-in-use") {
          setError("Error: Este correo ya ha sido registrado");
        } else {
          setError(error.message);
          console.error("Error:", error.message);
        }
      }
    }
  };

  const showVisible = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <>
      <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <img class="mx-auto w-1/2" src={logo} alt="Your Company" />
          <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {registering ? "Iniciar sesión" : "Registrarse"}
          </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form class="space-y-6" onSubmit={handleSubmit}>
            {!registering ? (
              <>
                <div>
                  <label
                    htmlFor="name"
                    class="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Nombre*
                  </label>
                  <div class="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      class="block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ringt-teal-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    class="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Teléfono*
                  </label>
                  <div class="mt-2">
                    <input
                      id="phone"
                      name="phone"
                      type="number"
                      autoComplete="phone"
                      required
                      class="block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ringt-teal-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </>
            ) : null}
            <div>
              <label
                htmlFor="email"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Correo electrónico*
              </label>
              <div class="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  class="block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ringt-teal-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Contraseña*
              </label>
              <div class="mt-2">
                <div class="relative">
                  <input
                    id="hs-toggle-password"
                    name="password"
                    type={isPasswordVisible ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    class="block w-full px-3 pr-10 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                  />
                  <button
                    type="button"
                    onClick={showVisible}
                    class="absolute top-1/2 right-3 transform -translate-y-1/2 p-2.5"
                    aria-label={
                      isPasswordVisible ? "Hide password" : "Show password"
                    }
                  >
                    {isPasswordVisible ? (
                      <svg
                        class="flex-shrink-0 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"></path>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"></path>
                      </svg>
                    ) : (
                      <svg
                        class="flex-shrink-0 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                        <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              {registering ? (
                <button
                  type="submit"
                  class="flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  Iniciar sesión
                </button>
              ) : (
                <button
                  type="submit"
                  class="flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  Registrarse
                </button>
              )}
            </div>
            {error && <p class="text-red-500 text-sm mt-1">{error}</p>}
          </form>
          <p class="mt-10 text-center text-sm text-gray-500">
            {registering ? (
              <>
                {" "}
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setRegistering(!registering);
                    setError(undefined);
                  }}
                  class="font-semibold leading-6 text-teal-600 hover:text-teal-500"
                >
                  Regístrate
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setRegistering(!registering);
                  setError(undefined);
                }}
                class="font-semibold leading-6 text-teal-600 hover:text-teal-500"
              >
                Inicia sesión
              </button>
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
