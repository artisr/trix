#= require trix/controllers/attachment_editor_controller
#= require trix/utilities/dom

class Trix.AttachmentEditorController
  constructor: (@attachment, @element, @container) ->
    @removeButton = document.createElement("a")
    @removeButton.setAttribute("href", "#")
    @removeButton.setAttribute("title", "Remove")
    @removeButton.classList.add("remove")
    @removeButton.textContent = "⊗"
    @removeButton.addEventListener("click", @didClickRemoveButton)
    @element.appendChild(@removeButton)

  didClickRemoveButton: (event) =>
    event.preventDefault()
    event.stopPropagation()
    @attachment.remove()

  uninstall: ->
    @element?.removeChild(@removeButton)
    @delegate?.didUninstallAttachmentEditor(this)