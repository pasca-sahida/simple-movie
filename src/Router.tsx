import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Movies: any = lazy(() => import("./Pages/Movies"));
const Detail: any = lazy(() => import("./Pages/Detail"));

const Router = (Props: any) => {
  return (
    <Suspense fallback="">
      <Routes>
        <Route path="/" element={<Movies />} />
        <Route path="/detail" element={<Detail />} />
      </Routes>
    </Suspense>
  );
};

export default Router;
