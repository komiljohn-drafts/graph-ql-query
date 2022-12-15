import baseUrl from "./baseUrl";
import { useEffect, useState } from "react";
import cls from "./styles.module.scss";

const Continents = () => {
  const [items, setItems] = useState([]);
  const [loader, setLoader] = useState(false);
  const [continentCode, setContinentCode] = useState("");

  const getContinents = () => {
    setLoader(true);
    fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query Query {
          continents {
            code
            name
          }
        }`,
      }),
    })
      .then((res) => res.json())
      .then((res) => setItems(res.data))
      .finally(() => setLoader(false));
  };

  const getCountries = (code) => {
    console.log("code", code);
    setLoader(true);
    fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query Continent {
          continent(code: \"${code}\") {
            code
            name
            countries {
              code
              phone
              emoji
              native
              name
              currency
              languages {
                name
                rtl
              }
            }
          }
        }`,
        variables: {
          code,
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => setItems(res.data))
      .finally(() => setLoader(false));
  };

  useEffect(() => {}, []);

  useEffect(() => {
    if (continentCode) {
      getCountries(continentCode);
    } else {
      getContinents();
    }
  }, [continentCode]);

  return (
    <div>
      <h1>
        {continentCode
          ? `Countries of ${items?.continent?.name}`
          : "Continents"}
      </h1>
      <div className={cls.continents}>
        {loader
          ? "Getting data..."
          : continentCode
          ? items?.continent?.countries?.map((item) => (
              <div key={item.code} className={cls.country}>
                <h3>{`${item.name} ${item.emoji} ${item.native}`}</h3>
                <p>
                  <b>County code: </b>
                  {item.code}
                </p>
                <p>
                  <b>Currency: </b>
                  {item.currency}
                </p>
                <p>
                  <b>Languages: </b>
                  {item.languages.reduce(
                    (acc, cur) => acc + " " + cur.name,
                    ""
                  )}
                </p>
                <p>
                  <b>County phone starts with: </b>
                  {item.phone}
                </p>
              </div>
            ))
          : items?.continents?.map((item) => (
              <div
                key={item.code}
                className={cls.continent}
                onClick={() => setContinentCode(item.code)}
              >
                {item.name}
              </div>
            ))}
      </div>
      {continentCode && (
        <div onClick={() => setContinentCode("")} className={cls.goBackBtn}>
          {`<`} Go back to continents
        </div>
      )}
      <div>
        <p>
          <b>GraphQL fake server url: </b>
          https://countries.trevorblades.com/graphql
        </p>
        <p>
          <b>Query: </b>
          <pre>
            {continentCode
              ? `query Continent {
          continent(code: \"${continentCode}\") {
            code
            name
            countries {
              code
              phone
              emoji
              native
              name
              currency
              languages {
                name
                rtl
              }
            }
          }
        }`
              : `query Query {
                continents {
                  code
                  name
                }
              }`}
          </pre>
        </p>
      </div>
    </div>
  );
};

export default Continents;
