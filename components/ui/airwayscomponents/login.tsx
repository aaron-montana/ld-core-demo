//@ts-nocheck
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoginContext from "@/utils/contexts/login";
import { useContext } from "react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import BookedFlights from "./bookedFlights";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  password: z.string().min(4, { message: "Invalid email address" }),
});

export default function LoginScreen() {
  const { isLoggedIn, setIsLoggedIn, loginUser, logoutUser, user } =
    useContext(LoginContext);
  const [username, setUsername] = useState("");

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logoutUser();
    setUsername("");
  };

  const handleLogin = async () => {
    await setIsLoggedIn(true);
    await loginUser("Jenn");
  };

  return (
    <Popover>
      <PopoverTrigger>
        {isLoggedIn ? (
          <Avatar>
            <AvatarImage src="/woman.png" alt="woman" />
            <AvatarFallback>LD</AvatarFallback>
          </Avatar>
        ) : (
          <Button
            variant={"ghost"}
            className="text-white bg-gradient-to-r from-airlinepurple to-airlinepink font-audimat text-sm uppercase px-8 rounded-none"
          >
            Login
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="dark w-[400px] bg-white">
        <div>
          {!isLoggedIn ? (
            <div className="my-10 flex items-center text-3xl flex-col">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="138"
                width="230"
                className="pr-2"
              >
                <image
                  href="/airline-login.svg"
                  height="138"
                  width="230"
                  alt="Launch Airways"
                />
              </svg>
            </div>
          ) : (
            <div className="mx-auto flex place-content-center w-full">
              <img src="woman.png" className="rounded-full h-48" />
            </div>
          )}
          {isLoggedIn && (
            <p className="outfitters text-2xl text-black font-sohne text-center py-4">
              Welcome Back!
            </p>
          )}
        </div>
        <div className="grid justify-center">
          {!isLoggedIn ? (
            <>
              <div className="w-full px-8">
                <div>
                  <Input
                    placeholder="Email"
                    className="mb-8 3xl:mb-24 outline-none border-0 border-b-2 border-zinc-200 rounded-none text-lg bg-white"
                  />
                </div>
                <Button
                  onClick={handleLogin}
                  className="w-full mx-auto font-sohnelight text-white rounded-none bg-gradient-to-tr from-airlinepurple to-airlinepink text-lg"
                >
                  Sign in with SSO
                </Button>
              </div>

              <div className="flex flex-row justify-between px-4 pb-8 pt-4 3xl:pt-14">
                <div className="text-blue-600 text-xs">
                  <p>Forgot Password?</p>
                </div>
                <div>
                  <p className="text-black text-xs">
                    Don't have an account?{" "}
                    <a href="/bank" className="text-blue-600">
                      Sign Up
                    </a>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto text-center items-center align-center flex text-black font-sohnelight pt-4 font-robotobold text-xl items-center align-center">
                <p className="pt-4">
                  Thank you for flying Launch Airways at{" "}
                  <span className="text-2xl">Platinum Tier</span>!
                </p>
              </div>
              <div className="mx-auto text-center">
                <Button
                  onClick={handleLogout}
                  className="text-xl bg-red-700 text-white items-center my-6 w-full bg-gradient-to-tr from-airlinepurple to-airlinepink text-lg rounded-none"
                >
                  Logout
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
