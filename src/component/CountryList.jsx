import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

function CountryList() {
  const { loading, cities } = useCities();
  if (loading) return <Spinner />;
  if (!cities.length) return <Message message="add your first city" />;

  const arr = [...new Map(cities.map((v) => [v.country, v])).values()];

  return (
    <>
      <ul className={styles.countryList}>
        {arr.map((country) => {
          return <CountryItem country={country} key={country.id} />;
        })}
      </ul>
    </>
  );
}

export default CountryList;
