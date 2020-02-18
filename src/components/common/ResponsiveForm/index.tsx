import React from "react";
import SelectFormGroup from "../SelectFormGroup/index"
import { Input, SelectInput, TextInput } from "../../../@types/types"

interface Props {
  inputFields: Input[];
  setInputFields?: Function;
  handleSearch: (btnClickEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

//TODO do typed generation of inputFields in own Functions



const ResponsiveForm: React.FC<Props> = ({ inputFields, setInputFields, handleSearch }) => {

  const generateTextFormGroup = (textInput: TextInput, inputFields: Input[], index: number): JSX.Element | TypeError => {
    if(textInput.type !== "text")throw new TypeError(`Tried to generate a textInputFormGroup, which type is not set to 'text'. Input with label: ${textInput.label}`);
    if(typeof textInput.value !== "string")throw new TypeError(`You have to pass in a string, when the input type is set to 'text'. Error at input with label: ${textInput.label}`);
    return (
      <div key={`responsiveForm_formGroup_${index}`} className="form-group">
        <label>{textInput.label}</label>
        <input className="form-control" type="text" id={textInput.id} placeholder={textInput.placeHolder} value={textInput.value} onChange={(evt) => {
          inputFields[index].value = evt.currentTarget.value;
          let newInput = [...inputFields]
          return setInputFields ? setInputFields(() => newInput) : null
        }}/>
      </div>
    );
  }

  const generateSelectFormGroup = (selectInput: SelectInput, inputFields: Input[], index: number): JSX.Element | TypeError => {
      if(typeof(selectInput.value) !== 'object')throw new TypeError(`You have to pass in an array of objects if selected type of input is 'select'. Given input-label: ${selectInput.label}`);
      if(!Array.isArray(selectInput.value))throw new TypeError(`You have to pass in an array of objects if selected type of input is 'select'. Given input-label: ${selectInput.label}`);
      if(!selectInput.value[0].label || !selectInput.value[0].value)throw new TypeError(`You have to pass in an array of objects if selected type of input is 'select'. Given input-label: ${selectInput.label}`);
      return (
        <SelectFormGroup options={selectInput.value} onChange={(evt)=>{
          let curVal = evt.currentTarget.value;
          let valueObjects = [...(selectInput.value as [])];

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

  }

  return (
    <form id="responsiveForm">
      {inputFields.map((input, index) => {
        //Type casted to TextInput
          if(input.type === "text"){
            return generateTextFormGroup(input as TextInput, inputFields, index);
          }

        if(input.type === "select"){ //TODO add type casting
          return generateSelectFormGroup(input as SelectInput, inputFields, index)
        }
      })}
      <button className="btn btn-secondary" onClick={(evt) => handleSearch(evt)}>Search</button>
    </form>
  );
};

export default ResponsiveForm;
