"use client";

import { parseJwt } from "@/lib/parseJwt";
import { redirect, usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { toast } from "sonner"

type UserInfo = {
  sub: string;
  user_id: string;
  name: string;
  email: string;
  picture: string;
};

interface LoginParams {
  email: string;
  password: string;
}


interface RegisterParams {
  email: string;
  username: string;
  name: string;
  password: string;
}


type AuthContextType = {
  token: string | null;
  login: (params: LoginParams) => void;
  logout: () => void;
  register: (params: RegisterParams) => void,
  userInfo: UserInfo | null;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => { },
  logout: () => { },
  register: () => { },
  userInfo: null,
});

type Props = {
  children?: React.ReactNode;
};
const AuthProvider: React.FC<Props> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  // const login = () => {
  //   fetch(`${process.env.NEXT_PUBLIC_IAM_HOST}/login`, {
  //     method: "GET",
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.error) {
  //         console.error(data.error);
  //       } else {
  //         window.location.href = data.url;
  //       }
  //     });
  // };

  const login = process.env.INTEGRATED_MODE == "false" ?
    ({ email, password }: LoginParams) => {
      fetch(`${process.env.NEXT_PUBLIC_ONBOARDING_HOST}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data) {
            localStorage.setItem("token", data.data)
            router.push("/")
          } else {
            console.error(data.error);
          }
        });
    } : () => {
      console.log(process.env.INTEGRATED_MODE);
      fetch(`${process.env.NEXT_PUBLIC_IAM_HOST}/login`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error(data.error);
          } else {
            window.location.href = data.url;
          }
        });
    };

  const register = ({ email, username, name, password }: RegisterParams) => {
    fetch(`${process.env.NEXT_PUBLIC_ONBOARDING_HOST}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, name, password }),
    })
      .then((res) => {
        if (res.ok) {
          toast.success("Successfully Registered", {
            description: "redirecting you to home page."
          })
          router.push('/login');
        } else {
          let data = res.json()
          toast.error("Failed to Register", {
            description: "",
          })
          return
        }
      })

  }


  const logout = process.env.INTEGRATED_MODE == "false" ?
    () => {
      fetch(`${process.env.NEXT_PUBLIC_IAM_HOST}/logout`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.removeItem("token");
          setToken(null);
          window.location.href = data.url;
        });
    } :
    () => {
      fetch(`${process.env.NEXT_PUBLIC_IAM_HOST}/logout`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.removeItem("token");
          setToken(null);
          window.location.href = data.url;
        });
    };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      const getMe = process.env.INTEGRATED_MODE == "false" ? () => {
        fetch(`${process.env.NEXT_PUBLIC_ONBOARDING_HOST}/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token} `,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data)
            if (data.data) {
              setUserInfo({
                user_id: data.data.id,
                name: data.data.name,
                email: data.data.email,
                sub: "",
                picture: "",
              });
            } else {
              console.log(data.data)
            }
          });
      } : () => {

        const { sub, name, email, picture } = parseJwt(token);
        setUserInfo({ user_id: "", name: name, email: email, sub: sub, picture: picture });
      }

      getMe()
    } else {
      return;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, register, token, userInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
