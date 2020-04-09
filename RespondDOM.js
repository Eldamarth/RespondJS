const Reconciler = {
  //  Takes a virtual element created by Respond.createElement(), a container node, and the old DOM element to replace or update.
  //  The old DOM element doesn't necessarily exist, i.e. at first call of render method.
  diff: () => {
    const oldVirtualElement = oldDomElement && oldDomElement._virtualElement;

    if (oldVirtualElement && oldVirtualElement.type === virtualElement.type) {
      if (oldVirtualElement.type === "text") {
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

  updateTextNode: (domElement, newVirtualElement, oldVirtualElement) => {
      if (newVirtualElement.props.textContent !== oldVirtualElement.props.textContent) {
          domElement.textContent = newVirtualElement.props.textContent;
      }
      // saves a reference to the virtual element into the domElement
      domElement._virtualElement =  newVirtualElement;
  },

  updateDomElement: (domElement, newVirtualElement, oldVirtualElement) => {
    const newProps = newVirtualElement.props;
    const oldProps = oldVirtualElement.props;

    Object.keys(newProps).forEach( (propName) => {
        const newProp = newProps[propName];
        const oldProp = oldProps[propName];

        if (newProp !== oldProp) {
            if (propName.slice(0,2) === 'on') {
                // this prop is an event handler!
                const eventName = propName.toLowerCase().slice(2);
                domElement.addEventListener(eventName, newProp, false);
                if (oldProp){
                    domElement.removeEventListener(eventName, oldProp, false);
                }
            } else if (propName === 'value' || propName === 'checked') {
                // this prop contains special attributes that cannot be set using setAttribute
                domElement[propName] = newProp;
            } else if (propName !== 'children') {
                // ignores the 'children' prop
                domElement.setAttribute(propName, newProps[propName]);

            }
        }

    });

    // removes oldProps

    Object.keys(oldProps).forEach( (propName)=> {
        const newProp = newProps[propName];
        const oldProp = oldProps[propName];

        if (!newProp) {
            if (propName.slice(0,2)==='on'){
                // this prop is an event handler!
                domElement.removeEventListener(propName, oldProp, false);
            } else if (propName !== children ) {
                // ignores the 'children' prop
                domElement.removeAttribute(propName);
            }
        }
    });


  },

  mountElement: () => {
    let newDomElement;
    const nextSibling = oldDomElement && oldDomElement.nextSibling;

    if (virtualElement.type === 'text'){
        newDomElement = document.createTextNode(virtualElement.props.textContent);
    } else {
        newDomElement = document.createElement(newDomElement, virtualElement);
    }

    // saves the element on the domElement
    newDomElement._virtualElement = virtualElement;

    // removes the old node from the dom (if extant)
    if (oldDomElement) {
        oldDomElement.remove();
    }

    // adds the newly created node to the dom
    if (nextSibling) {
        container.insertBefore(newDomElement, nextSibling);
    } else {
        container.appendChild(newDomElement);
    }

    //  recursively calls mountElement for all child elements
    virtualElement.children.forEach( (childElement) => {
        Reconciler.mountElement(childElement, newDomElement);
    })

  }
};

export default {
  render: (element, container) => {
    Reconciler.diff(element, container, container.firstChild);
  }
};
