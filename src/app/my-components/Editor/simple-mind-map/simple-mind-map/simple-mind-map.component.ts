import {Component, OnInit} from '@angular/core';
import {EditorInterface} from "../../editor-interface";
import MindMap  from "simple-mind-map";

@Component({
  selector: 'app-simple-mind-map',
  templateUrl: './simple-mind-map.component.html',
  standalone:true,
  styleUrls: ['./simple-mind-map.component.css'
  ]
})
export class SimpleMindMapComponen implements  EditorInterface,OnInit{

  mindMap: MindMap | undefined ;
  ngOnInit():void{
    this.mindMap = new MindMap({
      el: document.getElementById('mindMapContainer'),
      data: {
        "data": {
          "text": "根节点"
        },
        "children": []
      }
    });
  }
  Destroy(): void {

  }

  Disabled(): void {
  }

  Enable(): void {
  }

  GetContent(): string {
    return "";
  }

  GetYourName(): string {
    return "simple-mind-map";
  }

  IsReady(): boolean {
    return false;
  }

  SetContent(value: string, clearCache: boolean): void {

  }

}
