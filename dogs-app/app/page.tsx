"use client"
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from 'react';
import {LoaderIcon, Dog} from "lucide-react"

export default function Home() {

  const [dogs, setDogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);


  useEffect(() => {
    async function fetchDogs() {
      setLoading(true)
      const apiResponse = await axios.get(`/api/dogs/${page}`);
      console.log(apiResponse.data.dogs)
      setDogs(apiResponse.data.dogs)
      setLoading(false)
      console.log(dogs)
    }

    fetchDogs();
  }, [page]);

  return (
    <div className="flex flex-col items-center justify-center p-24 gap-8 bg-gray-100">
      <h1 className="text-4xl font-bold">Dogs</h1>
      <div className="flex flex-col items-start justify-center gap-2">
      {
        loading ?  <LoaderIcon className="animate-spin mt-64 h-8 w-8"/> :
        dogs && dogs.map((dog: any) => {
          return (
            <div
              key={dog.breed}
              className="w-full flex flex-row gap-4 items-center bg-white border-2 p-2 border-slate-600 rounded shadow-md"
            >
             { dog.image ? <img className="w-8 h-8 rounded" src={dog.image } alt=""></img> :
             <Dog /> }
              <p>{dog.breed}</p>
            </div>
          )
        })
      }
      </div >
      <div className="flex flex-row gap-4 items-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"  onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setPage(page + 1)}>
          Next
        </button>
        {page}
      </div>

    </div>
  );
}
