import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const Detail = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [datas, setData] = useState<any>();
  const navigate: any = useNavigate();

  const [searchParams] = useSearchParams();
  const id: any = searchParams.get("id");

  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = async () => {
    const url: string = `https://api.themoviedb.org/3/movie/${id}`;
    setLoader(true);
    axios
      .get(url, {
        headers: {
          Accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNDA4ZGYwZmY1ZTk2NzA5MDk2ZDYyMjY0OTc3Zjg5MSIsInN1YiI6IjY0NmVlYzZmMTEzMGJkMDFmYTFmNzg4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.M_sfAKYjeruUUmXowANzBkGYRZrcxdVVTHfH2Oyrpj0",
        },
      })
      .then(function (response) {
        setLoader(false);
        setData(response.data);
      });
  };
  return (
    <>
      <section className="bg-white pb-10 md:pb-32 pt-5">
        <div className="grid gap-4 px-8 mx-auto md:w-4/12 mt-10">
          <div className="justify-center content-center">
            {loader ? (
              <div className="text-lg text-black font-slate-500 font-sans my-6 text-center">
                Please wait ...
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-8">
                <img
                  className="w-80 h-96 rounded mx-auto border border-gray-300 drop-shadow-lg"
                  src={
                    datas &&
                    `https://image.tmdb.org/t/p/w220_and_h330_face${datas.poster_path}`
                  }
                  alt=""
                  width="284"
                  height="412"
                />
                <div className="text-3xl text-black font-bold font-sans my-0 text-center">
                  {datas && datas.title}
                </div>
                <div className="text-kg text-slate-400 font-bold font-sans my-0 text-center">
                  Release Date :{" "}
                  {moment(datas && datas.release_date).format("MMM Do YYYY")}
                </div>
                <div className="text-lg text-black font-bold font-slate-500 font-sans ">
                  Overview
                </div>
                <div className="text-sm text-slate-400 font-slate-500 font-sans ">
                  {datas && datas.overview}
                </div>
                <div className="text-lg text-black font-bold font-slate-500 font-sans ">
                  Production Companies
                </div>
                <div className="text-sm text-slate-400 font-slate-500 font-sans">
                  {datas &&
                    datas.production_companies.map((comp: any, index: any) => {
                      return <div key={index}>{comp.name}</div>;
                    })}
                </div>
                <div className="text-lg text-black font-bold font-slate-500 font-sans ">
                  Genres
                </div>
                <div className="text-sm text-slate-400 font-slate-500 font-sans">
                  {datas &&
                    datas.genres.map((gen: any, index: any) => {
                      return <div key={index}>{gen.name}</div>;
                    })}
                </div>
                <button
                  type="button"
                  className="flex btn w-full bg-red-600 hover:bg-red-400 text-white font-semibold py-3 px-8 rounded-lg justify-center"
                  onClick={() => navigate("/")}
                >
                  Back
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Detail;
