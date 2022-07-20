/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = function getArea() {
    return this.width * this.height;
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.assign(Object.create(proto), JSON.parse(json));
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  errorOneTime: 'Element, id and pseudo-element should not occur more then one time inside the selector',
  errorOrder: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',

  element(value) {
    if (this.elementValue) {
      throw new Error(this.errorOneTime);
    }
    if (this.idValue) {
      throw new Error(this.errorOrder);
    }
    const temp = { ...this };
    if (!temp.elementValue) {
      temp.elementValue = value;
    } else {
      temp.elementValue += value;
    }
    return temp;
  },

  id(value) {
    if (this.idValue) {
      throw new Error(this.errorOneTime);
    }
    if (this.classValue || this.pseudoElementValue) {
      throw new Error(this.errorOrder);
    }
    const temp = { ...this };
    if (!temp.idValue) {
      temp.idValue = `#${value}`;
    } else {
      temp.idValue += `#${value}`;
    }
    return temp;
  },

  class(value) {
    if (this.attributeValue) {
      throw new Error(this.errorOrder);
    }
    const temp = { ...this };
    if (!temp.classValue) {
      temp.classValue = `.${value}`;
    } else {
      temp.classValue += `.${value}`;
    }
    return temp;
  },

  attr(value) {
    if (this.pseudoClassValue) {
      throw new Error(this.errorOrder);
    }
    const temp = { ...this };
    if (!temp.attributeValue) {
      temp.attributeValue = `[${value}]`;
    } else {
      temp.attributeValue += `[${value}]`;
    }
    return temp;
  },

  pseudoClass(value) {
    if (this.pseudoElementValue) {
      throw new Error(this.errorOrder);
    }
    const temp = { ...this };
    if (!temp.pseudoClassValue) {
      temp.pseudoClassValue = `:${value}`;
    } else {
      temp.pseudoClassValue += `:${value}`;
    }
    return temp;
  },

  pseudoElement(value) {
    if (this.pseudoElementValue) {
      throw new Error(this.errorOneTime);
    }
    const temp = { ...this };
    if (!temp.pseudoElementValue) {
      temp.pseudoElementValue = `::${value}`;
    } else {
      temp.pseudoElementValue += `::${value}`;
    }
    return temp;
  },

  combine(selector1, combinator, selector2) {
    const temp = { ...this };
    const value = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    if (!temp.value) {
      temp.value = value;
    } else {
      temp.value += value;
    }
    return temp;
  },

  stringify() {
    if (this.value) {
      return this.value;
    }
    let value = '';
    if (this.elementValue) value += this.elementValue;
    if (this.idValue) value += this.idValue;
    if (this.classValue) value += this.classValue;
    if (this.attributeValue) value += this.attributeValue;
    if (this.pseudoClassValue) value += this.pseudoClassValue;
    if (this.pseudoElementValue) value += this.pseudoElementValue;
    return value;
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
