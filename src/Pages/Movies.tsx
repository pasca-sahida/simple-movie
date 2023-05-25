import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";

const schema: any = yup.object().shape({
  user_search: yup.string().required("This field is required"),
  user_year: yup.string().matches(
    /^([12][0-9]{3})?$/,
    "Insert valid year"
  ),
});

const Movies = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [datas, setData] = useState<any>();
  const navigate : any = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      user_search: "",
      user_year: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {

    const url : string = `https://api.themoviedb.org/3/search/movie?query=${data.user_search}&include_adult=false&language=en-US&page=1`;
    setLoader(true);
    axios.get(url, {
      headers:{
        Accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNDA4ZGYwZmY1ZTk2NzA5MDk2ZDYyMjY0OTc3Zjg5MSIsInN1YiI6IjY0NmVlYzZmMTEzMGJkMDFmYTFmNzg4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.M_sfAKYjeruUUmXowANzBkGYRZrcxdVVTHfH2Oyrpj0"
      }
    })
    .then(function (response) {
      setLoader(false);

      const tempData = response.data.results;
      const tempDatas: any = [];
      let year: string = "";
      if (data.user_year !== "") {
        year = data.user_year;
      }

      if (year === "") {
        tempData.map((data: any, index: Number) => {
          if (data.poster_path !== null && data.poster_path !== "") {
            tempDatas.push({
              id: data.id,
              title: data.title,
              release_date: new Date(data.release_date),
              image: `https://image.tmdb.org/t/p/w220_and_h330_face${data.poster_path}`,
              vote_average: data.vote_average,
              language: data.original_language
            })
          }
        })
      } else {
        tempData.map((data: any, index: Number) => {
          const tempDate = data.release_date.split('-');
          if (data.poster_path !== null && data.poster_path !== "" && tempDate[0] === year) {
            tempDatas.push({
              id: data.id,
              title: data.title,
              release_date: new Date(data.release_date),
              image: `https://image.tmdb.org/t/p/w220_and_h330_face${data.poster_path}`,
              vote_average: data.vote_average,
              language: data.original_language
            })
          }
        })
      }

      setData(tempDatas)
    })
  };

  const Sorting = (sort: any) => {
    
    if (sort === "date") {
      setData([].concat(datas.sort((a: any, b: any) => b.release_date - a.release_date)));
    }
    if (sort === "vote") {
      setData([].concat(datas.sort((a: any, b: any) => b.vote_average - a.vote_average)));

    }

  }

  return (
    <>
    <section className="bg-white pb-10 md:pb-32 pt-5">
      <div className="grid gap-4 px-8 mx-auto md:w-4/12 mt-10">
        <div className="justify-center content-center">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 mt-8">
              <label className="text-black">Search Movies Titlte (Required)</label>
              <input
                type="text"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-[-1rem]"
                placeholder="Type here"
                {...register("user_search")}
                autoComplete="off"
              />
              {errors.user_search && (
                <small className="flex text-red-500 mt-[-1rem]">
                  {errors.user_search.message}
                </small>
              )}
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <label className="text-black">Movies Year</label>
              <input
                type="text"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-[-1rem]"
                placeholder="Type here"
                {...register("user_year")}
                autoComplete="off"
              />
              {errors.user_year && (
                <small className="flex text-red-500 mt-[-1rem]">
                  {errors.user_year.message}
                </small>
              )}
            </div>
            <div className="flex mt-5">
              <button
                type="submit"
                className="flex btn w-full bg-sky-500/100 hover:bg-sky-500/50 text-white font-semibold py-3 px-8 rounded-lg justify-center"
              >
                {loader ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Please wait ...
                  </>
                ) : (
                  <>Search</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
    {
      datas && datas.length > 0 ? (
        <section className="bg-white  md:pb-2 pt-5">
          <div className="grid gap-4 md:grid-cols-2 px-5 mx-auto max-w-screen-2xl">
              <select
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-[-1rem]"
                onChange={(e) => { Sorting(e.target.value)}}
              >
                <option value="no">No sorting</option>
                <option value="date">Sort by release date</option>
                <option value="vote">Sort by average vote</option>
              </select>
          </div>
        </section>

      ): <></>
    }
    <section className="bg-white pb-10 md:pb-32 pt-5">
      {
        datas && datas.length === 0 ?
        (
          <div className="grid gap-4 px-8 mx-auto md:w-4/12 mt-10">
          <div className="justify-center content-center">
            <h5 className="mb-4 max-w-3xl text-4xl leading-none md:text-5xl xl:text-6xl text-slate-500 text-center">
              Movies not found
            </h5>
          </div>
        </div>
        ) :
        (
        <div className="grid gap-4 md:grid-cols-4 px-5 mx-auto max-w-screen-2xl">
          {
            datas && datas.map((data: any, index: any) => {
              return (
                <div className="py-5 md:py-5 px-3" key={index}>
                  <img className="w-full h-96 rounded mx-auto border border-gray-300 drop-shadow-lg" src={data.image} alt="" width="284" height="412" />
                  <div className="flex-col">
                    <button
                      type="button"
                      className="flex btn w-full bg-red-600 hover:bg-red-400 text-white font-semibold py-3 px-8 rounded-lg justify-center"
                      onClick={() => navigate(`/detail?id=${data.id}`)}
                    >
                      Detail
                    </button>
                    <div className="text-3xl text-black font-bold font-sans my-6">
                      {data.title}
                    </div>
                    <div className="text-xl text-slate-500 font-bold font-sans my-1">
                      Release Date : {moment(data.release_date).format("MMM Do YYYY")}
                    </div>
                    <div className="text-md text-slate-800 font-bold font-sans my-1">
                      Average Vote : {data.vote_average.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>

        )
      }
    </section>
    </>
  );
};

export default Movies;
