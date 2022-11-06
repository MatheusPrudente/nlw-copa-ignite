import appPreviewImg from "../assets/nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import avataresImg from "../assets/avatares.png";
import checkImg from "../assets/icon-check.svg";
import Image from "next/image";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolCount: number;
  guessesCount: number;
  usersCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post('/pools', {
        title : poolTitle
      });

      const { code } = response.data

      await navigator.clipboard.writeText(code)
      
      alert("Bolão criado com sucesso, o código foi copiado para a área de transferencia")
      setPoolTitle('')
    } catch (error) {
      console.log(error)
      alert("Falha ao criar o bolão, tente novamente")
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="NLW Copa" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={avataresImg} alt="" />
          <strong className="text-ignite-gray-100 text-xl">
            <span className="text-ignite-green-500">+{props.usersCount}</span>{" "}
            pessoas já estão usando
          </strong>
        </div>
        <form
          onSubmit={createPool}
          className="mt-10 flex gap-2 text-ignite-gray-100"
        >
          <input
            onChange={(event) => setPoolTitle(event.target.value)}
            value={poolTitle}
            className="flex-1 px-6 py-4 rounded bg-ignite-gray-800 border-ignite-gray-600 text-sm "
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
          />
          <button
            className="bg-ignite-yellow-500 px-6 py-4 rounded font-bold text-ignite-gray-900 text-sm uppercase hover:bg-ignite-yellow-700"
            type="submit"
          >
            Criar meu Bolão
          </button>
        </form>
        <p className="mt-4 text-sm text-ignite-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>
        <div className="mt-10 pt-10 border-t border-ignite-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={checkImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-ignite-gray-600"></div>
          <div className="flex items-center gap-6">
            <Image src={checkImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessesCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma previa da aplicacao movel do NLW Copa"
      />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessesCountResponse, usersCountResponse] =
    await Promise.all([
      api.get("pools/count"),
      api.get("guesses/count"),
      api.get("users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessesCount: guessesCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
    },
  };
};
