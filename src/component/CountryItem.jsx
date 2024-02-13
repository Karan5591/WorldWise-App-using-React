import styles from "./CountryItem.module.css";

function CountryItem({ country }) {
  return <li className={styles.countryItem}>{country.country}</li>;
}

export default CountryItem;
