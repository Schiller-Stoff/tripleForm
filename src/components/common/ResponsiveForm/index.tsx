import React from "react";
import SelectFormGroup from "../SelectFormGroup/index"

interface inputField {
  label: string;
  value: string | Array<{label:string, value: string}>;
  type: "text" | "select" | "autocomplete";
  id: string;
  placeHolder?: string;
}

interface Props {
  inputFields: inputField[];
  setInputFields?: Function;
  handleSearch: (btnClickEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const ResponsiveForm: React.FC<Props> = ({ inputFields, setInputFields, handleSearch }) => {
  return (
    <form id="responsiveForm">
      {inputFields.map((input, index) => {

        //case input field is plain input type == when the value is a plain string.
          if(input.type === "text"){
            if(typeof input.value !== "string")throw new TypeError(`You have to pass in a string, when the input type is set to 'text'. Error at input with label: ${input.label}`);
          return (
            <div key={`responsiveForm_formGroup_${index}`} className="form-group">
              <label>{input.label}</label>
              <input className="form-control" type="text" id={input.id} placeholder={input.placeHolder} value={input.value} onChange={(evt) => {
                inputFields[index].value = evt.currentTarget.value;
                let newInput = [...inputFields]
                return setInputFields ? setInputFields(() => newInput) : null
              }}/>
            </div>
          );
        }

        if(input.type === "select")
            if(typeof(input.value) !== 'object')throw new TypeError(`You have to pass in an array of objects if selected type of input is 'select'. Given input-label: ${input.label}`);
            if(!Array.isArray(input.value))throw new TypeError(`You have to pass in an array of objects if selected type of input is 'select'. Given input-label: ${input.label}`);
            if(!input.value[0].label || !input.value[0].value)throw new TypeError(`You have to pass in an array of objects if selected type of input is 'select'. Given input-label: ${input.label}`);
            return (
              <SelectFormGroup options={input.value} onChange={(evt)=>{
                let curVal = evt.currentTarget.value;
                let valueObjects = [...(input.value as [])];

                //sets the _selected property to true from element linked to evt.currentTarget
                //and others to false.
                (valueObjects as []).forEach((obj: {label: string, value:string, _selected: boolean}) => {
                  if(obj.value === curVal){
                    obj._selected = true;
                  } else {
                    obj._selected = false;
                  };
                });

                //@ts-ignore
                let newInpVal = [...input.value];
                //@ts-ignore
                let inputs = [...inputFields];
                //@ts-ignore
                inputs[index].value = newInpVal;
                //console.log(inputs);
                
                return setInputFields ? setInputFields(()=>inputs) : null
              }}/>
            )
      })}
      <button className="btn btn-secondary" onClick={(evt) => handleSearch(evt)}>Search</button>
    </form>
  );
};

export default ResponsiveForm;
