import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { bus, preloadApp, startApp as rawStartApp, destroyApp, setupApp, plugin } from 'wujie';

export type lifecycle = (appWindow: Window) => any;
export type loadErrorHandler = (url: string, e: Error) => any;

@Component({
  selector: 'wujie-for-angular',
  template: '',
  host: {
    '[style.width]': 'width',
    '[style.height]': 'height'
  }
})
export class WujieForAngularComponent implements AfterViewInit, OnChanges, OnDestroy {
  static bus = bus;
  static setupApp = setupApp;
  static preloadApp = preloadApp;
  static destroyApp = destroyApp;

  /** 组件宽高尺寸 */
  @Input() width?: string;
  @Input() height?: string;
  /** 唯一性用户必须保证 */
  @Input() name!: string;
  /** 需要渲染的url */
  @Input() url!: string;
  /** 子应用加载时loading元素 */
  @Input() loading?: HTMLElement;
  /** 子应用保活模式，state不会丢失 */
  @Input() alive?: boolean;
  /** 自定义fetch */
  @Input() fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  /** 注入给子应用的属性 */
  @Input() props?: { [key: string]: any };
  /** 自定义iframe属性 */
  @Input() attrs?: { [key: string]: any };
  /** 代码替换钩子 */
  @Input() replace?: (code: string) => string;
  /**
     * 路由同步开关
     * 如果false，子应用跳转主应用路由无变化，但是主应用的history还是会增加
     * https://html.spec.whatwg.org/multipage/history.html#the-history-interface
     */
  @Input() sync?: boolean;
  /** 子应用短路径替换，路由同步时生效 */
  @Input() prefix?: { [key: string]: string };
  /** 子应用采用fiber模式执行 */
  @Input() fiber?: boolean;
  /** 子应用采用降级iframe方案 */
  @Input() degrade?: boolean;
  /** 子应用采用降级iframe方案 */
  @Input() plugins?: Array<plugin>;
  /** 子应用生命周期 */
  @Input() beforeLoad?: lifecycle;
  /** 没有做生命周期改造的子应用不会调用 */
  @Input() beforeMount?: lifecycle;
  @Input() afterMount?: lifecycle;
  @Input() beforeUnmount?: lifecycle;
  @Input() afterUnmount?: lifecycle;
  /** 非保活应用不会调用 */
  @Input() activated?: lifecycle;
  @Input() deactivated?: lifecycle;
  /** 子应用资源加载失败后调用 */
  @Input() loadError?: loadErrorHandler;
  @Output() events = new EventEmitter<{ event: string; args: Array<any> }>();

  private startAppQueue: Promise<Function | void> = Promise.resolve();

  private handleEmit(event: string, ...args: Array<any>) {
    this.events.emit({ event, args });
  }

  private async startApp() {
    try {
      await rawStartApp({
        name: this.name,
        url: this.url,
        el: this.wujieElementRef.nativeElement,
        loading: this.loading,
        alive: this.alive,
        fetch: this.fetch,
        props: this.props,
        attrs: this.attrs,
        replace: this.replace,
        sync: this.sync,
        prefix: this.prefix,
        fiber: this.fiber,
        degrade: this.degrade,
        plugins: this.plugins,
        beforeLoad: this.beforeLoad,
        beforeMount: this.beforeMount,
        afterMount: this.afterMount,
        beforeUnmount: this.beforeUnmount,
        afterUnmount: this.afterUnmount,
        activated: this.activated,
        deactivated: this.deactivated,
        loadError: this.loadError
      })
    } catch (error) {
      console.log('运行无界子应用出现异常,', error)
    }
  }

  private execStartApp() {
    this.startAppQueue = this.startAppQueue.then(this.startApp.bind(this))
  }

  constructor(private wujieElementRef: ElementRef) { }

  ngAfterViewInit(): void {
    bus.$onAll(this.handleEmit.bind(this));
  }

  ngOnChanges(changes: { [P in keyof this]?: SimpleChange } & SimpleChanges): void {
    if (changes.name?.currentValue !== changes.name?.previousValue ||
      changes.url?.currentValue !== changes.url?.previousValue) {
      this.execStartApp();
    }
  }

  ngOnDestroy(): void {
    bus.$offAll(this.handleEmit);
    !this.alive && destroyApp(this.name);
  }
}
