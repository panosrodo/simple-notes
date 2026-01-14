import {useEffect} from "react";

const HomePage = () => {
  
  useEffect(()=> {
    document.title = "Simple Notes Home Page";
  }, []);

  return (
    <>
    </>
  )
}
export default HomePage;