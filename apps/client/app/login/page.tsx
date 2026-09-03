"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// import { loginUser, ApiError } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Digite um e-mail válido."),
  password: z.string().min(1, "Digite sua senha."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  /*

  async function onSubmit(data: LoginFormData) {
    setServerError(null);
    try {
      const { accessToken } = await loginUser(data);

      // TODO: replace with the Context API auth provider once it's built.
      localStorage.setItem("stockbox_token", accessToken);
      router.push("/estoque");
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else {
        setServerError("Não foi possível entrar. Tente novamente.");
      }
    }
  } */

  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="hidden w-2/5 flex-col justify-between bg-[#7A1F3D] px-12 py-16 text-[#FDF3ED] lg:flex">
        <span className="font-serif text-2xl">StockBox</span>

        <div>
          <h1 className="font-serif text-4xl leading-tight">
            Bom te ver
            <br />
            de novo.
          </h1>
          <p className="mt-4 max-w-sm text-[#F3D5C9]">
            Entre pra continuar cuidando do estoque e fechando as vendas do
            dia.
          </p>
        </div>

        <p className="text-sm text-[#D89D8A]">
          Ainda não tem uma loja aqui?{" "}
          <Link href="/" className="underline underline-offset-4">
            Criar minha loja
          </Link>
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col justify-center bg-[#FDF6F0] px-6 py-16 lg:w-3/5">
        <div className="mx-auto w-full max-w-sm">
          <h2 className="font-serif text-3xl text-[#3A2419]">Entrar</h2>
          <p className="mt-2 text-sm text-[#7A6A60]">
            Use o e-mail e a senha da sua loja.
          </p>

          <form
            onSubmit={handleSubmit(() => undefined)} //solve this
            className="mt-10 space-y-6"
            noValidate
          >
            <Field
              label="E-mail"
              type="email"
              error={errors.email?.message}
              inputProps={register("email")}
              placeholder="ana@exemplo.com"
            />

            <Field
              label="Senha"
              type="password"
              error={errors.password?.message}
              inputProps={register("password")}
            />

            {serverError && (
              <p className="text-sm text-[#B3261E]" role="alert">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-none bg-[#7A1F3D] py-3 text-sm font-medium text-[#FDF3ED] transition-colors hover:bg-[#5F1830] disabled:opacity-60"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-8 text-sm text-[#7A6A60] lg:hidden">
            Ainda não tem uma loja aqui?{" "}
            <Link href="/cadastro" className="text-[#7A1F3D] underline underline-offset-4">
              Criar minha loja
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Same underline-style Field used on the cadastro page, kept local here too.
// If a third form shows up, this is the signal to move it to components/forms/Field.tsx.
function Field({
  label,
  error,
  inputProps,
  type = "text",
  placeholder,
}: {
  label: string;
  error?: string;
  inputProps: ReturnType<ReturnType<typeof useForm>["register"]>;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-[#3A2419]">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        {...inputProps}
        className="mt-1 w-full border-0 border-b border-[#D9C6BC] bg-transparent py-2 text-[#3A2419] outline-none placeholder:text-[#B8A69B] focus:border-[#7A1F3D]"
      />
      {error && (
        <span className="mt-1 block text-xs text-[#B3261E]">{error}</span>
      )}
    </label>
  );
}
