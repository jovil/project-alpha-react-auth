import React, { useEffect, useState } from "react";
import { apiUrl } from "../../utils/fetchConfig";
import { getFetchConfig } from "../../utils/fetchConfig";
import { NavLink } from "react-router-dom";

const SeriesListPage = () => {
  const [seriesList, setSeriesList] = useState<Array<any> | null>(null);
  useEffect(() => {
    const fetchSeriesList = async () => {
      const url = `${apiUrl}/series`;

      try {
        const response = await fetch(url, getFetchConfig);
        const result = await response.json();
        console.log("result", result);
        setSeriesList(result);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchSeriesList();
  }, []);

  // Step 1: Sort the series titles alphabetically
  const sortedSeriesList = (seriesList ?? []).sort((a, b) =>
    a.localeCompare(b)
  );

  // Step 2: Group the titles by their first letter
  const groupedSeries = sortedSeriesList.reduce((accumulator, title) => {
    const firstLetter = title[0].toUpperCase();
    if (!accumulator[firstLetter]) {
      accumulator[firstLetter] = [];
    }
    accumulator[firstLetter].push(title);
    return accumulator;
  }, {} as Record<string, string[]>);

  return (
    <>
      <div className="max-w-[948px] w-full mx-auto flex flex-col gap-4 min-h-[100vh] pb-16">
        <header className="h-[28px] flex items-center">
          <h1>All series</h1>
        </header>
        <section className="flex flex-col gap-3">
          {Object.keys(groupedSeries)
            .sort()
            .map((letter, index) => (
              <div
                className="flex flex-col gap-3 py-6 border-b border-black-100/40 last:border-0"
                key={index}
              >
                <h2 className="font-medium">{letter}</h2>
                <div className="flex flex-col gap-3">
                  {groupedSeries[letter].map((title: string, subIndex: any) => (
                    <div key={subIndex}>
                      <NavLink
                        className="underline capitalize"
                        to={`/series/${title}`}
                      >
                        {title}
                      </NavLink>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </section>
      </div>
    </>
  );
};

export default SeriesListPage;
