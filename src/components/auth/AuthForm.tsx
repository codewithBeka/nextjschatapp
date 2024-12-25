"use client";

import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { toast } from "react-hot-toast";
import Input from "../inputs/Input";
import Button from "../Button";
import AuthSocialButton from "./AuthSocialButton";
import Image from "next/image";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/conversations");
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === "REGISTER") {
      axios
        .post("/api/register", data)
        .then(() =>
          signIn("credentials", {
            ...data,
            redirect: false,
          })
        )
        .then((callback) => {
          if (callback?.error) {
            toast.error("Invalid credentials!");
          }

          if (callback?.ok) {
            router.push("/conversations");
          }
        })
        .catch(() => toast.error("Something went wrong!"))
        .finally(() => setIsLoading(false));
    }

    if (variant === "LOGIN") {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error("Invalid credentials!");
          }

          if (callback?.ok) {
            router.push("/conversations");
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid credentials!");
        }

        if (callback?.ok) {
          router.push("/conversations");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <div className="flex w-full h-screen">
        <div className="w-full flex items-center justify-center lg:w-1/2 pt-60">
          <form
            className="w-11/12 max-w-[700px] px-10 py-20 rounded-3xl bg-white border-2 border-gray-100"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h1 className="text-4xl text-center font-semibold text-violet-500">
              Wel Come to Mogogram
            </h1>
            <div className="mt-8">
              {variant === "REGISTER" && (
                <Input
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                  required
                  id="name"
                  label="Name"
                  placeholder="John Doe"
                />
              )}
              <Input
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                id="email"
                label="Email address"
                type="email"
                placeholder="email"
              />
              <Input
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                id="password"
                label="Password"
                type="password"
                placeholder="password"
              />
              <div className="mt-8 flex flex-col gap-y-4">
                <button
                  disabled={isLoading}
                  type="submit"
                  className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out transform py-4 bg-violet-500 rounded-xl text-white font-bold text-lg"
                >
                  {variant === "LOGIN" ? "Sign in" : "Register"}
                </button>
                <span className="bg-white text-center px-2 text-gray-500">
                  Or continue with
                </span>
                <div className="flex items-center  justify-center gap-2 ">
                  <AuthSocialButton
                    icon={BsGithub}
                    onClick={() => socialAction("github")}
                  />
                  <AuthSocialButton
                    icon={BsGoogle}
                    onClick={() => socialAction("google")}
                  />
                </div>
                <div className=" flex justify-center items-center">
                  <p className="font-medium text-base">
                    {variant === "LOGIN"
                      ? "New to Messenger?"
                      : "Already have an account?"}
                  </p>
                  <div>
                    <button
                      onClick={toggleVariant}
                      className="ml-2 font-medium text-base text-violet-500"
                    >
                      {variant === "LOGIN" ? "Sign Up" : "Login"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="hidden relative w-1/2 h-full lg:flex items-center justify-center bg-gray-200">
          <div className="w-60 h-60 rounded-full bg-gradient-to-tr from-violet-500 to-pink-500 animate-spin" />
          <div className="w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg" />
        </div>
      </div>
    </>
  );
};

export default AuthForm;
