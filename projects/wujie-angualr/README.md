# Angualr 组件封装

无界基于 Angular 框架的组件封装

## 安装

```bash
npm i wujie-angular -S
```

## 引入

```JavaScript
@Component({
  imports: [WujieAngularModule],
})
export class AppComponent {}
```

## 使用

```html
<wujie-angular
  name="angular.cn"
  url="https://angular.cn/"
  width="100%"
  height="100%"
  [sync]="true"
  [beforeLoad]="onBeforeload"
>
</wujie-angular>
```
