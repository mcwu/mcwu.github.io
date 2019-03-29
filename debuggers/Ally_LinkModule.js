/*****************
 * Link Module
 ****************/
QSI.Link = QSI.util.Creative({
  initialize: function(options) {
    console.log('============== QSI DEBUGGING START ====================');
    this.globalInitialize(options);

    if (this.options.locators) {
      console.log('has locators');
      QSI.PipedText.setLocators(this.options.locators);
      this.options.text = QSI.PipedText.evaluateLocators(this.options.text);
    }

    console.log('before shouldShow() check');
    if (this.shouldShow()) {
      console.log('passed shouldShow() check');
      this.insertLink();
    }
    console.log('============== QSI DEBUGGING START ====================');

  },
  insertLink: function() {

    console.log('in insertLink() function');
    console.log('insertionLocation: ' + this.options.insertionLocation);
    console.log('targetURL: ' + this.options.targetURL);

    if (this.options.insertionLocation && this.options.targetURL) {

      console.log('about to build link');

      var text = this.options.text || this.options.targetURL;
      this.link = QSI.util.build('a', {
        className: 'QSILink '+ this.id + '_Link',
        href: 'javascript:void(0);'// jshint ignore:line
      }, text);
      new QSI.Target(this.link, this.getTargetHelper(), this.actionOptions, this);

      console.log('about to insert link');
      console.log(QSI.util.$(this.options.insertionLocation));

      QSI.util.$(this.options.insertionLocation).appendChild(this.link);

      console.log('after insert link');

      this.impress();
      this.displayed.resolve();
    }
  },
  remove: function() {
    if (this.link) {
      QSI.util.remove(this.link);
    }
  }
});