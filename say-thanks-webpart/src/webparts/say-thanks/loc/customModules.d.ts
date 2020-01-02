declare interface ISayThanksWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  hintTextUserName: string;
  hintTextWordsOfThanks: string;
  panePropertyLoc: {
    userNameLable: string,
    wordsOfThanksLable: string
  };
}

declare module 'SayThanksWebPartStrings' {
  const strings: ISayThanksWebPartStrings;
  export = strings;
}
