const Reconciler = {
  //  Takes a virtual element created by Respond.createElement(), a container node, and the old DOM element to replace or update.
  //  The old DOM element doesn't necessarily exist, i.e. at first call of render method.
  diff: () => {
    const oldVirtualElement = oldDomElement && oldDomElement._virtualElement;

    if (oldVirtualElement && oldVirtualElement.type === virtualElement.type) {
      if (oldVirtualElement.tyoe === "text") {
        Reconciler.updateTextNode(
          oldDomElement,
          virtualElement,
          oldVirtualElement
        );
      } else {
        Reconciler.updateDomElement(
          oldDomElement,
          virtualElement,
          oldVirtualElement
        );
      }

      // saves the virtualElement on the domElement
      oldDomElement._virtualElement = virtualElement;

      virtualElement.children.forEach((childElemen, i) => {
        Reconciler.diff(
          childElement,
          oldDomElement,
          oldDomElement.childNodes[i]
        );
      });

      // removes excess children
      const oldChildren = oldDomElement.childNodes;
      if (oldChildren.length > virtualElement.children.length) {
        for (
          let i = oldChildren.length - 1;
          i >= virtualElement.children.length;
          i--
        ) {
          oldChildren[i].remove();
        }
      }
    } else {
      Reconciler.mountElement(virtualElement, container, oldDomElement);
    }
  },

  updateTextNode: () => {},

  updateDomElement: () => {},

  mountElement: () => {}
};

export default {
  render: (element, container) => {
    Reconciler.diff(element, container, container.firstChild);
  }
};
