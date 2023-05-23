import { type NextPage } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { FormGroup } from "~/components/FormGroup";
import { Input } from "~/components/Input";
import { api } from "~/utils/api";


const GeneratePage: NextPage = () => {

  const [form, setForm] = useState({
    prompt: "",
  });

  const generateIcon = api.generate.generateIcon.useMutation({
    onSuccess: (data) => {
      console.log("success", data)
    },
  });

  function handleSubmit(e: FormEvent){
    e.preventDefault();
    // submit form data to the backend
    generateIcon
  }

  function updateForm(key: string){
    return function (e: ChangeEvent<HTMLInputElement>){
      setForm((prev)=>({
      ...prev,
      [key]: e.target.value}));
  }}

  return (<>
      <Head>
        <title>Create</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col min-h-screen justify-center items-center">
        <button onClick={()=>{signIn().catch(console.error)}} className="rounded bg-white px-4 py-2 hover:bg-blue-500">Login</button>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormGroup>
            <label className="text-gray-100 font-bold text-lg">Prompt</label>
            <Input value={form.prompt} onChange={updateForm("prompt")} type="text" />
          </FormGroup>

          <button className="rounded bg-blue-400 px-4 py-2 hover:bg-blue-500">Submit</button>
        </form>
      </main>
    </>);
};

export default GeneratePage;
