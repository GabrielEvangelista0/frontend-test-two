import axios from "axios";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled, {ThemeProvider} from "styled-components";
import Footer from "../src/components/Footer/Footer";
import Header from "../src/components/Header/Header";
import RecepieCard from "../src/components/RecepeCard/RecepeCard";
import Recommendations from "../src/components/Recommendations/Recommendations";
import { listaDeReceitas, themeSwitchState } from "../src/state/atom"
import { themeLightMode } from "../src/theme/theme";

export default function Home() {
  const Setreceitas = useSetRecoilState(listaDeReceitas)
  const lightSwitch = useSetRecoilState(themeSwitchState)
  const lightSwitchState = useRecoilValue(themeSwitchState)
  const receitas = useRecoilValue(listaDeReceitas)
  const options = {
    method: 'GET',
    url: 'https://api.spoonacular.com/recipes/random?apiKey=b73fd94a241d457e8185de13a637ac03',
    params: {
      limitLicense: false,
      number: 30
    },
    headers: {
      "Content-Type": "application/json"
    },
    Type: 'b73fd94a241d457e8185de13a637ac03'
  };

  useEffect(() => {
    const recipeList = JSON.parse(localStorage.getItem('recipelist'))
    const darkMode = localStorage.getItem('darkMode')
    const date = new Date
    const hours = date.getHours()
    localStorage.setItem('hours', JSON.stringify(hours))
    const savedHors = JSON.parse(localStorage.getItem('hours'))

    if(darkMode == 'on'){
      lightSwitch(!lightSwitchState)
    }else{
      lightSwitch(true)
    }

    if(recipeList == null || hours != savedHors){
      axios.request(options).then(function (response) {
        localStorage.setItem('recipelist', JSON.stringify(response.data.recipes))
        Setreceitas(response.data.recipes);
      }).catch(function (error) {
        console.error(error);
      });
    }else{
      Setreceitas(recipeList)
    }
  }, [])

  return (
    <div>
      <ThemeProvider theme={themeLightMode}>
        <Header />
        <Recommendations

        />

        <StyledMoreRecepies>
          <h2>
            More Recipes
          </h2>
          <div className="more__grid-container">
            {receitas.map(recipe => (
              <div className="more__card-container" key={recipe.id}>
                <RecepieCard
                  title={recipe.title}
                  img={recipe.image}
                  to={recipe.id}
                />
              </div>
            ))}
          </div>
        </StyledMoreRecepies>
        <Footer/>
      </ThemeProvider>
    </div>
  )
}

const StyledMoreRecepies = styled.section`
width: 80%;
margin: 2rem auto;
padding: 1rem;

h2{
  margin: 3rem 0;
  color: ${themeLightMode.typography.primaryColor};
}

.more__grid-container{
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  grid-gap: 2rem;

  .more__card-container{
    min-width: 400px;
    min-height: 300px;
  }
}

@media screen and (max-width: 1024px) {
    .more__grid-container{
      width: 100%;
      display: flex;
      flex-direction: column;
      
      .more__card-container{
          min-width: 400px  ;
          height: 300px;
      }
    }
}

@media screen and (max-width: 770px) {
    .more__grid-container{
      width: 100%;
      display: flex;
      flex-direction: column;
        grid-template-columns: 1fr;
        .more__card-container{
          min-width: 200px;
          height: 300px;
        }
    }
}

`
