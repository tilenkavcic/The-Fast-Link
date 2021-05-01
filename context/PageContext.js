import { createContext, useState } from "react";

export const PageContext = createContext();

export const PageProvider = (props) => {
	const [pageData, setPageData] = useState(props);

  return (
    <PageContext.Provider value={[pageData, setPageData]}>
      {props.children}
    </PageContext.Provider>
  )

};
