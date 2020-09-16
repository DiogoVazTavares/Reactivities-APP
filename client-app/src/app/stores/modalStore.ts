import { action, observable } from "mobx";
import { RootStore } from "./rootStore";

export default class ModalStore {
  roorStore: RootStore;

  constructor(rootStore: RootStore) {
    this.roorStore = rootStore;
  }

  // this is a complex object. Mobx, in case of objects/complex properties try to observe each one.
  // because of the behaviour we do .shallow to performe the comparations just at the first level of the object
  @observable.shallow modal = {
    open: false,
    content: null,
  };

  @action openModal = (content: any) => {
    this.modal.open = true;
    this.modal.content = content;
  };

  @action closeModal = () => {
    this.modal.open = false;
    this.modal.content = null;
  };
}
