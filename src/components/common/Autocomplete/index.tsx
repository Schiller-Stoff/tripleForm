import React from "react";
import Autosuggest from 'react-autosuggest';

// Imagine you have a list of languages that you'd like to autosuggest.
const languages = [
    {
      name: 'C',
      year: 1972
    },
    {
      name: 'Elm',
      year: 2012
    },
    {
        name: 'Peter',
        year: 1932
      },
      {
        name: 'Pez',
        year: 1932
      },
      {
        name: 'Peanut',
        year: 1932
      },
      {
        name: 'PETA',
        year: 1932
      },  
  ];

const getSuggestions = (value: string) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : languages.filter(lang =>
      lang.name.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = (suggestion: any) => {
    console.log("getSuggestionValue: ",suggestion);
    return suggestion.name
};

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion: any) => { 
    console.log("RenderSuggestion: ", suggestion)
    return (
    <div id="nice!">
      {suggestion.name}
    </div>
    )
}

const AutoComplete: React.FC = () => {

    const [value, setValue] = React.useState<string>("");

    //needs to be let because getter has to be set!
    let [suggestions, setSuggestions] = React.useState<string[]>([]);

    const onChange = (event: any, { newValue }: any) => {
        setValue(newValue);
    };

    
    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    const onSuggestionsFetchRequested = ({ value }: any) => {
        console.log("onSuggestionsFetchRequested:", value);
        //setting getter method to be handled inside the autosuggest
        //@ts-ignore
        suggestions = getSuggestions(value);
        let newSugs = Array.from(suggestions);
        
        console.log(newSugs);
        setSuggestions(()=>newSugs);
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    const onSuggestionsClearRequested = () => {
        setSuggestions([]);    
    };

    const inputProps = {
        placeholder: 'Type a programming language',
        value,
        onChange: onChange
    }; 

    return (
        <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
      />
    )

}

export default AutoComplete;