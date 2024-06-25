"use client";

import { parseJwt } from "@/lib/parseJwt";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

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


type AuthContextType = {
  token: string | null;
  login: (params: LoginParams) => void;
  logout: () => void;
  userInfo: UserInfo | null;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => { },
  logout: () => { },
  userInfo: null,
});

type Props = {
  children?: React.ReactNode;
};
const AuthProvider: React.FC<Props> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const pathname = usePathname();

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
      fetch(`${process.env.NEXT_PUBLIC_IAM_HOST}/auth/login`, {
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
          } else {
            console.error(data.error);
          }
        });
    } : () => {
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
        fetch(`${process.env.NEXT_PUBLIC_IAM_HOST}/auth/me`, {
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
    <AuthContext.Provider value={{ login, logout, token, userInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
