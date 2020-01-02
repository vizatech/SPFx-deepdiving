import * as pnp from 'sp-pnp-js';

import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './PnPspcrudWebPart.module.scss';
import * as strings from 'PnPspcrudWebPartStrings';

export interface ISPList {
  ID: string;
  EmployeeName: string;
  Experience: string;
  Location: string;
}  

export interface IPnPspcrudWebPartProps {
  description: string;
}

export default class PnPspcrudWebPart extends BaseClientSideWebPart<IPnPspcrudWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div class="parentContainer" style="background-color: lightgrey">
        <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
          <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
          
            <span class="ms-font-xl ms-fontColor-white" style="font-size:28px">
              Welcome to SharePoint Framework Development using PnP JS Library
            </span>
            <p class="ms-font-l ms-fontColor-white" style="text-align: left">
              Demo : SharePoint List CRUD using PnP JS and SPFx
            </p>
            
          </div>
        </div>
        <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
          <div style="background-color:Black;color:white;text-align: center;font-weight: bold;font-size:18px;">
            Employee Details
          </div>
        </div>
        <div style="background-color: lightgrey">
          <form>
            <br />

            <div data-role="header">
              <h3>Add SharePoint List Items</h3>
            </div>

            <div data-role="main" class="ui-content">
              <div>
                <input id="EmployeeName" placeholder="EmployeeName" />
                <input id="Experience"  placeholder="Experience" />
                <input id="Location"  placeholder="Location" />
              </div>
              <div>
                <br />
              </div>
              <div >
                <button id="AddItem" type="submit">Add</button>
              </div>
            </div>

            <div data-role="header">
              <h3>Update/Delete SharePoint List Items</h3>
            </div>

            <div data-role="main" class="ui-content">
              <div >
                <input id="EmployeeId" placeholder="EmployeeId" />
              </div>
              <div>
                <br />
              </div>
              <div >
                <button id="UpdateItem" type="submit" >Update</button>
                <button id="DeleteItem"  type="submit" >Delete</button>
              </div>
            </div>

          </form>
        </div>
        <br />
        <div style="background-color: lightgrey" id="spGetListItems">
        </div>
      </div>
    `;
    this.getListData();
    this.AddEventListeners(); 
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

  private AddEventListeners() : void{
    document.getElementById('AddItem').addEventListener( 'click', () => this.AddItem() );
    document.getElementById('UpdateItem').addEventListener( 'click', () => this.UpdateItem() );
    document.getElementById('DeleteItem').addEventListener( 'click', () => this.DeleteItem() );
  }

  AddItem() {
    pnp.sp.web.lists.getByTitle('EmployeeList').items.add( {
        EmployeeName : document.getElementById('EmployeeName')["value"],
        Experience : document.getElementById('Experience')["value"],
        Location: document.getElementById('Location')["value"]
      } );
    alert( "Record with Employee Name : " + document.getElementById('EmployeeName')["value"] + " Added !");
  }
  
  UpdateItem() {
    var id = document.getElementById('EmployeeId')["value"];
    pnp.sp.web.lists.getByTitle("EmployeeList").items.getById(id).update({
        EmployeeName : document.getElementById('EmployeeName')["value"],
        Experience : document.getElementById('Experience')["value"],
        Location:document.getElementById('Location')["value"]
      });
    alert("Record with Employee Name : "+ document.getElementById('EmployeeName')["value"] + " Updated !");
  }
  
  DeleteItem() {
    pnp.sp.web.lists.getByTitle("EmployeeList").items.
      getById(document.getElementById('EmployeeId')["value"]).delete();
    alert("Record with Employee ID : "+ document.getElementById('EmployeeId')["value"] + " Deleted !");
  }

  private _getListData(): Promise<ISPList[]> {
    return pnp.sp.web.lists.getByTitle("EmployeeList").items.get().then((response) => {
      return response;
    });
  }

  private getListData(): void {
    this._getListData().then((response) => { 
      this._renderList(response);
    });
  }

  private _renderList(items: ISPList[]): void {
    let html: string = '<table class="TFtable" border=1 width=100% style="bordercollapse: collapse;">';
    html += `<th>EmployeeId</th><th>EmployeeName</th><th>Experience</th><th>Location</th>`;
    items.forEach((item: ISPList) => { 
      html += `<tr>
                <td>${item.ID}</td>
                <td>${item.EmployeeName}</td>
                <td>${item.Experience}</td>
                <td>${item.Location}</td>
              </tr>`;
    });
    html += `</table>`;
    const listContainer: Element = this.domElement.querySelector('#spGetListItems');
    listContainer.innerHTML = html;
  }

}
