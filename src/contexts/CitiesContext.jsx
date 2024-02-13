import {
  createContext,
  useState,
  useEffect,
  useContext,
  useReducer,
} from "react";
const URL = "http://localhost:8000";
const CitiesCotext = createContext();

const initalState = {
  cities: [],
  loading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true };

    case "cities/loaded":
      return {
        ...state,
        loading: false,
        cities: action.payload,
      };

    case "city/loaded":
      return {
        ...state,
        loading: false,
        currentCity: action.payload,
      };
    case "city/created":
      return {
        ...state,
        loading: false,
        cities: [...state.cities, action.payload],
      };

    case "city/deleted":
      console.log(action.payload);
      return {
        ...state,
        loading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    case "rejected":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      throw new Error("An error occured...");
  }
}

function CitiesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initalState);
  const { cities, loading, currentCity } = state;

  // const [cities, setCities] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });

      try {
        const res = await fetch(`${URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({ type: "rejected", payload: "Error in loading cities...." });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${URL}/cities/${id}`);

      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({ type: "rejected", payload: "Error in loading data...." });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({ type: "rejected", payload: "Error in loading city...." });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({ type: "rejected", payload: "Error in deleting data...." });
    }
  }

  return (
    <CitiesCotext.Provider
      value={{ cities, loading, currentCity, getCity, createCity, deleteCity }}
    >
      {children}
    </CitiesCotext.Provider>
  );
}
function useCities() {
  const context = useContext(CitiesCotext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
