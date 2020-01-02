import * as pnp from 'sp-pnp-js';

import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './RetrieveSearchResultsWebPart.module.scss';
import * as strings from 'RetrieveSearchResultsWebPartStrings';

export interface IRetrieveSearchResultsWebPartProps {
  description: string;
}

export default class RetrieveSearchResultsWebPart extends BaseClientSideWebPart<IRetrieveSearchResultsWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.retrieveSearchResults }">
        <div class="${ styles.container }">
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${ styles.row }">
            <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <span class="ms-font-xl ms-fontColor-white" style="font-size: 28px;">
                Welcome to SharePoint Framework Development using PnP JS Library
              </span>
              <p class="ms-font-l ms-fontColor-white" style="text-align: left;">
                Demo : Retrieve SharePoint Search Result
              </p>
            </div>
          </div>
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${ styles.row }">
            <div style="background-color: black; color: white; text-align: center; font-weight: bold; font-size: 18px;">
              Search Results
            </div>
            <br />
            <div id="spSearchResults">
            </div>
          </div> 
        </div>
      </div>`;
      this.GetSearchResults(); 
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }

  private GetSearchResults(): void {
    pnp.sp.search("SharePoint")
      .then( (result) => {
        var props = result.PrimarySearchResults;
        var propValue = "";
        var counter = 1;
        props.forEach( (object) => {
          propValue += counter++ + '. ' + 
                      'Title - ' + object.Title + '<br/>' + 
                      'Rank - ' + object.Rank + '<br/>' + 
                      'File Type - ' + object.FileType + '<br/>' + 
                      'Original Path - ' + object.OriginalPath + '<br/>' + 
                      'Summary - ' + object.HitHighlightedSummary + '<br/>' + '<br/>';
        });
        document.getElementById("spSearchResults").innerHTML = propValue;
      })
      .catch( (err) => {
        console.log("Error: " + err);
      });
  }

}
