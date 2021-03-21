"use strict";
/**
 * Client-side example Script. Built to be inclusive of IE 11
 * 
 * @version 2021.03.20.00
 */

/**
 * Call anonymous function to perform client-side validations and manipulations.
 */
$(function () {
  /**
   * Object to hold the static strings of the file.
   */
  var TXT = {
    AriaHidden: "aria-hidden",
    DataName: "[data-name='{0}']",
    Empty: "",
    ErrorMessage: "<a href=\'#{0}_label\' onclick=\'javascript:scrollToAndFocus(\"{0}_label\",\"{0}\");return false;\'>{1}</a>",
    False: "false",
    Hidden: "hidden",
    ID: "id",
    Label: "_label",
    None: "none",
    Required: "required",
    RequiredValidator: "RequiredFieldValidator",
    RequiredMessage: "<span class='font-weight-bold'>{0}</span> is a required field.",
    Select: "select",
    Span: "span",
    Show: "show",
    Tag: "#",
    TD: "td",
    True: "true",
    Undefined: "undefined",
    Underscore: "_",
    ValidatorDiv: "<div class='validators'></div>"
  };

  /**
   * Object to hold element names.
   */
  var ELEMS = {
    ActionDiv: "div.actions, div.form-custom-actions",
    InfoDiv: "div.info",
    RequiredElements: "input,textarea,select",
    Submit: "#UpdateButton",
    ValidatorDiv: "div.validators"
  };

  /**
   * Object to hold static string option values.
   */
  var OPTIONS = {
    None: "",
    Yes: "0",
    No: "1"
  };

  var TYPES = {
    Static: "0",
    Dynamic: "1"
  };

  /**
   * Validates this element is not undefined or null, inclusive of IE browsers.
   * 
   * @param {any} elem Object to identify is not undefined or null.
   * @return {boolean} True if not undefined and null, otherwise false.
   */
  function canUse(elem) {
    return typeof elem !== TXT.Undefined && elem !== null;
  }

  /**
   * Validates this element has some amount of data.
   * 
   * @param {any} elem Object to identify containing any data.
   * @return {boolean} True if this element is useable and has data.
   */
  function hasData(elem) {
    return canUse(elem) && elem.length > 0;
  }

  // Initialize Page_Validators if it's missing.
  window.Page_Validators = window.Page_Validators || [];

  /**
   * Create a validator on a form element.
   * 
   * @param {string} fieldName The ID of the form element.
   * @param {string} validationGroup The validation group, to be used with specific
   * validations. Null is empty string (default).
   * @param {string} label The associated label of the form element.
   * @param {string} passedMessage The error message if validation fails.
   * @param {Function} func The function to check validation.
   * @param {string} initialValue The initial value of the field.
   */
  function newValidator(fieldName, validationGroup, label, passedMessage, func, initialValue) {
    var nV = document.createElement(TXT.Span);
    var message = passedMessage;
    nV.style.display = TXT.None;
    nV.validationGroup = validationGroup || TXT.Empty;
    nV.initialvalue = initialValue || TXT.Empty;
    nV.id = canUse(validationGroup) ? validationGroup + TXT.Underscore + fieldName : TXT.RequiredValidator + fieldName;
    nV.controltovalidate = TXT.Tag + fieldName;
    // If no specific validation message, but label is present, replace with basic required message
    if (hasData(label) === true && hasData(message) !== true) {
      message = String.format(TXT.RequiredMessage, label); // NOSONAR
    }
    if (hasData(message) === true) {
      nV.errormessage = String.format(TXT.ErrorMessage, fieldName, message); // NOSONAR
    }
    var $field = $(TXT.Tag + fieldName);
    // If no specific function is passed in, assume it's a check for empty
    if (typeof func === TXT.Undefined) {
      nV.evaluationfunction = function () {
        var value = $field.val();
        return value !== null && value !== TXT.Empty;
      };
    } else {
      nV.evaluationfunction = func;
    }
    var $validator = $field.closest(TXT.TD).find(ELEMS.ValidatorDiv);
    // If this field doesn't have a validator div, add one
    if ($validator.length === 0) {
      var $info = $field.closest(TXT.TD).find(ELEMS.InfoDiv);
      $validator = $(TXT.ValidatorDiv).appendTo($info);
    }
    $validator.append(nV);
    window.Page_Validators.push(nV);
  }

  /**
   * Adds a custom validator to a form element.
   * 
   * @param {Object} field Either a jQuery object or the string ID of an element.
   * @param {string} validationGroup The validation group, to be used with specific 
   * validations. Null is empty string (default), validates entire form.
   * @param {string} message Error message when validation fails.
   * @param {Function} func Function to validate violation.
   * @param {string} initialValue Initial value of the field.
   * @param {boolean} isRequired Whether or not this is a Required field validator.
   */
  function addValidator(field, validationGroup, message, func, initialValue, isRequired) {
    var fieldName = field instanceof jQuery ? field.attr(TXT.ID) : field;
    var $labelField = $(TXT.Tag + fieldName + TXT.Label);
    if (isRequired !== false) {
      $labelField.parent().addClass(TXT.Required);
    }
    newValidator(fieldName, validationGroup, $labelField.text(), message, func, initialValue);
  }

  /**
   * Remove a validator from a form element.
   * @param {Object} field Either a jQuery object or the string ID of an element.
   * @param {string} validator The name of the validator.
   * @param {boolean} isRequired Whether or not this is a Required field validator.
   */
  function removeValidator(field, validator, isRequired) {
    var fieldName = field instanceof jQuery ? field.attr(TXT.ID) : field;

    if (canUse(window.Page_Validators) === false) {
      return;
    }

    var $labelField = $(TXT.Tag + fieldName + TXT.Label);
    var validatorId = validator || TXT.RequiredValidator;

    $.each(window.Page_Validators, function (index, validator) {
      if (canUse(validator) &&
        hasData(validator.id) &&
        validator.id === validatorId + fieldName) {
        window.Page_Validators.splice(index, 1);
      }
    });

    if (isRequired !== false) {
      $labelField.parent().removeClass(TXT.Required);
    }
  }

  /**
   * Hide a form element's table cell.
   * 
   * @param {Object} $elem jQuery object of the form element.
   * @param {boolean} useShow If true, will remove the "show" class. 
   * Otherwise, will add the "hidden" class.
   */
  function cellHide($elem, useShow) {
    if (canUse(useShow) && useShow === true) {
      $elem.closest(TXT.TD).removeClass(TXT.Show);
    } else {
      $elem.closest(TXT.TD).addClass(TXT.Hidden);
    }
    $elem.attr(TXT.AriaHidden, TXT.True);
  }

  /**
   * Show a form element's table cell.
   * 
   * @param {Object} $elem jQuery object of the form element.
   * @param {boolean} useShow If true, will add the "show" class.
   * Otherwise, will remove the "hidden" class.
   */
  function cellShow($elem, useShow) {
    if (canUse(useShow) && useShow === true) {
      $elem.closest(TXT.TD).addClass(TXT.Show);
    } else {
      $elem.closest(TXT.TD).removeClass(TXT.Hidden);
    }
    $elem.attr(TXT.AriaHidden, TXT.False);
  }

  /**
   * If an option set is set to a specific value,
   * show/hide a field based on the value.
   * 
   * @param {Object} sourceId The element ID of the option set.
   * @param {Object} targetId The name of the table (section) 
   * or div (tab) to show/hide.
   * @param {string} optionValue The string value of the option set 
   * to trigger.
   * @param {boolean} makeRequired Whether or not fields should be required.
   * Defaults to true.
   */
  function dynamicField(sourceId, targetId, optionValue, makeRequired) {
    if (hasData(sourceId) !== true ||
     hasData(targetId) !== true) {
      return;
    }

    var $sourceField = sourceId instanceof jQuery ? sourceId : $(TXT.Tag + sourceId);
    var $targetField;
    var optionVal = optionValue || OPTIONS.Yes;

    if (hasData($sourceField) !== true) {
      return;
    }

    $targetField = targetId instanceof jQuery ? targetId : $(TXT.Tag + targetId);

    $sourceField.change(function () {
      if (this.value === optionVal) {
        cellShow($targetField);

        if (makeRequired !== false) {
          addValidator($targetField);
        }
      } else {
        cellHide($targetField);
        $targetField.val(TXT.Empty).change();

        if (makeRequired !== false) {
          removeValidator($targetField);
        }
      }
    }).change();
  }
  
  /**
   * Identify if an option set is set to a specific value,
   * and show/hide a section based on the value.
   * 
   * @param {string} sourceId The element ID of the option set.
   * @param {string} sectionName The name of the table (section) 
   * or div (tab) to show/hide.
   * @param {string} optionValue The string value of the option set 
   * to trigger.
   * @param {boolean} includeTitle Whether or not to show/hide the 
   * title. Defaults to false.
   * @param {boolean} makeRequired Whether or not fields should be required.
   * Defaults to true.
   * @param {string} requiredElements The list of required elements.
   * Defaults to Inputs, TextAreas and Select objects.
   */
  function dynamicSection(sourceId, sectionName, optionValue, includeTitle, makeRequired, requiredElements) {
    if (hasData(sourceId) !== true ||
     hasData(sectionName) !== true) {
      return;
    }

    var $sourceField = sourceId instanceof jQuery ? sourceId : $(TXT.Tag + sourceId);
    var $section;
    var optionVal = optionValue || OPTIONS.Yes;
    var requiredElems = requiredElements || ELEMS.RequiredElements;

    if (hasData($sourceField) !== true) {
      return;
    }

    $section = sectionName instanceof jQuery ? sectionName : 
    $(String.format(TXT.DataName, sectionName)); //NOSONAR

    $sourceField.change(function () {
      if (this.value === optionVal) {
        $section.show();

        if (makeRequired !== false) {
          $section.find(requiredElems).each(function () {
            addValidator(this.id);
          });
        }

        if (includeTitle === true) {
          $section.prev().show();
        }
      } else {
        $section.hide();

        $section.find(requiredElems).each(function () {
          this.value = TXT.Empty;
          if (makeRequired !== false) {
            removeValidator(this.id);
          }
        }).change();

        if (includeTitle === true) {
          $section.prev().hide();
        }
      }
    }).change();
  }

  // If this form is a specific type, we add X logic, else we add Y logic.
  var exampleType = $("#exampleType").val();

  if (hasData(exampleType) === false) {
    return;
  }

  if (exampleType === TYPES.Dynamic) {
    /**
     * If new_field1 is set to "No", we show Section 1.
     */
    dynamicSection("new_field1", "NameOfSection1", OPTIONS.No);

    /**
     * If new_field2 is set to "No", we show Section 2A.
     * Else, we show Section 2B and the Title of the section. 
     */
    dynamicSection("new_field2", "NameOfSection2A", OPTIONS.No);
    dynamicSection("new_field2", "NameOfSection2B", OPTIONS.Yes, true);

    /**
     * If new_field3 is "Yes", we show Section 3, show the title, make the fields required,
     * but only if they're "select" controls.
     */
    dynamicSection("new_field3", "NameOfSection3", OPTIONS.Yes, true, true, TXT.Select);

    /**
     * If new_field4 is "No", show and make new_field5 required.
     * If new_field6 is "Yes" (default), show and make new_field7 required.
     */
    dynamicField("new_field4", "new_field5", OPTIONS.No);
    dynamicField("new_field6", "new_field7");
  } else if (reviewType === TYPES.Static) {
    /**
     * If new_field4 is "No", show and make new_field5 required.
     * If new_field6 is "Yes" (default), show and make new_field7 required.
     */
     dynamicField("new_field4", "new_field5", OPTIONS.No);
     dynamicField("new_field6", "new_field7");
  }
});
