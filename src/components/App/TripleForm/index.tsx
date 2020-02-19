import React from "react";
import styles from "./styles.module.css"; //import css module here -> this variable can then be used in classname.
import ResponsiveForm from "../../common/ResponsiveForm";
import ConfigProvier from "../../common/ConfigProvider";
import {
  QueryInput,
  QuerySelectInput,
  SelectValue,
  TripleForm,
  RestPathVariableFormGroup
} from "../../../@types/types";

interface props {
  queryStart?: string;
  parameterDelimiter?: string;
  parameters?: QueryInput[];
  encode?: boolean;
}

const TripleFormReact: React.FC<props> = ({
  queryStart = undefined,
  parameterDelimiter = undefined,
  parameters = undefined
}) => {
  //for config linked with ConfigProvider
  const [gamsConfig, setGamsConfig] = React.useState<undefined | any>(
    undefined
  );
  //assigned in useEffect -> tripleFormConfig variable.
  const [tripleFormConfig, setTripleFormConfig] = React.useState<TripleForm | any>(undefined);

  const [query, setQuery] = React.useState<"" | string>("");
  const [queryInputs, setInputs] = React.useState<RestPathVariableFormGroup[] | undefined>(
    undefined
  );

  // initial useEffect to configure component
  React.useEffect(() => {
    if (!gamsConfig) return;
    if (!gamsConfig.tripleForm) {
      console.error(
        "No tripleForm property could've been detected. Make sure to apply configuration inside window._gamsComponentConfig.tripleForm"
      );
      return;
    }
    setTripleFormConfig(gamsConfig.tripleForm);
    setInputs(gamsConfig.tripleForm.properties);
  }, [gamsConfig]);

  //
  React.useEffect(() => {
    if (!queryInputs) return;
    let query = "";

    queryInputs.forEach(restVargroup => {
      if(query.includes(restVargroup.restPathVariable))throw new TypeError(`Found RestPathVariable a second time: ${restVargroup.restPathVariable}`);
      if ((query === "undefined") || (!query) ) {
        query = `${restVargroup.restPathVariable}=`;
      } else {
        query += `&${restVargroup.restPathVariable}=`;
      };

      restVargroup.formGroups.forEach((queryInput, inputObjIndex) => {
        parameterDelimiter = parameterDelimiter ? parameterDelimiter : tripleFormConfig.parameterDelimiter;
        //check which type queryInput has
        if (queryInput.type === "text") {
          query += `${ ((inputObjIndex===0) ? "" : parameterDelimiter)}${queryInput.parameter}${queryInput.value}`;
        }

        //check if type is queryInput or autocomplete
      if (queryInput.type === "select" || queryInput.type === "autocomplete") {
        //if array
        if (Array.isArray(queryInput.value)) {
          (queryInput.value as SelectValue[]).forEach((inputObj) => {
            //if _selected property set to true
            if (inputObj._selected === true){
              query += `${ ((inputObjIndex===0) ? "" : parameterDelimiter)}${queryInput.parameter}${inputObj.value}`;}
          });
        } else {
          throw new TypeError(
            `Encountered a not array type inside an queryInput marked as 'select'. Input's label is: ${queryInput.label}`
          );
        }
      }
      
      })
    })
    if (query === "undefined") return setQuery("");
    setQuery(query);
  }, [queryInputs]);

  const handleSearch = (
    btnClickEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    btnClickEvent.preventDefault(); //prevents default submit action on form.
    if (!query)
      return alert("wählen Sie einen gültigen Wert für die Suche aus.");
    if (!queryInputs)
      throw new TypeError(
        "Cannot start a search without any formGroups defined for the tripleForm!"
      );

    //TODO add validation    
    /* let inputErrFlag: boolean = false;
    queryInputs.forEach(queryInput => {  
      if (!queryInput.value) {
        inputErrFlag = true;
      }
    });
    if (inputErrFlag)
      return alert(
        "Bitte wählen Sie für alle Suchfelder einen gültigen Wert aus."
      ); */
    let url =
      (queryStart ? queryStart : tripleFormConfig.queryStart) + query;
    window.location.href = encodeURI(url);
  };

  return (
    <>

      <ConfigProvier
        windowConfigPropName={"_gamsComponentConfig"}
        setConfig={setGamsConfig}
      ></ConfigProvier>
      {queryInputs ? (
        <>
          <ResponsiveForm
            inputFields={queryInputs}
            setInputFields={setInputs}
            handleSearch={handleSearch}
          ></ResponsiveForm>
          {(tripleFormConfig.lifecycle ==="develop") ?<><br></br> <p><em>Query Builder</em><br></br> (set lifecycle to "deploy" to deactivate builder) </p> <p>Decoded: <br></br> {query}</p> <p>Encoded:<br></br> { encodeURIComponent(query)}</p> </> : null}
        </>
      ) : null}
    </>
  );
};

export default TripleFormReact;
