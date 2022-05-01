/* Active Menu */
const currentPage = location.pathname;
const menuItems = document.querySelectorAll("header .links a");

if (menuItems) {
  for (const item of menuItems) {
    if (currentPage.includes(item.getAttribute("href"))) {
      item.classList.add("active");
    }
  }
}

/*  */

const spans = document.querySelectorAll(".recipe-title span");
  for (let span of spans) {
    span.addEventListener("click", function() {
      const text = this.innerText;
      const content = this.parentElement.nextElementSibling;
        if (text === "Mostrar") {
          content.style.display= "block";
          this.textContent = "Esconder";
        }
        else {
          content.style.display= "none";
          this.textContent = "Mostrar";
        }
    })
}

// Create new field
const AddFields = {
  addIngredient() {
    const ingredients = document.querySelector("#ingredients");
    const fieldContainer = document.querySelectorAll(".ingredient");

    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;

    // Deixa o valor do input vazio
    newField.children[0].value = "";
    ingredients.appendChild(newField);
  },
  addPreparation() {
    const preparation = document.querySelector("#preparations");
    const fieldContainer = document.querySelectorAll(".preparation");

    // Realiza um clone da última preparação adicionada
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    // Deixa o valor do input vazio
    if (newField.children[0].value == "") return false;

    // Deixa o valor do input vazio
    newField.children[0].value = "";
    preparation.appendChild(newField);
  },
};

/* === DELETE CONFIRMATION === */

const formDelete = document.querySelector("#form-delete");

if (formDelete) {
  formDelete.addEventListener("submit", (event) => {
    const confirmation = confirm("Tem certeza que deseja deletar?");
    if (!confirmation) {
      event.preventDefault();
    }
  });
}

/* === PHOTOS UPLOAD === */

const PhotosUpload = {
  input: "",
  preview: document.querySelector("#photos-preview"),
  uploadLimit: "",
  files: [],
  handleFileInput(event, limit) {
    const { files: fileList } = event.target;
    PhotosUpload.input = event.target;
    PhotosUpload.uploadLimit = limit;

    if (PhotosUpload.hasLimit(event)) {
      PhotosUpload.updateInputFiles();

      return;
    }

    Array.from(fileList).forEach((file) => {
      PhotosUpload.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const div = PhotosUpload.getContainer(image);
        PhotosUpload.preview.appendChild(div);
      };

      reader.readAsDataURL(file);
    });

    PhotosUpload.updateInputFiles();
  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = PhotosUpload;
    const { files: fileList } = input;

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`);
      event.preventDefault();
      return true;
    }

    const photosDiv = [];
    preview.childNodes.forEach((item) => {
      if (item.classList && item.classList.value == "photo")
        photosDiv.push(item);
    });

    const totalPhotos = fileList.length + photosDiv.length;
    if (totalPhotos > uploadLimit) {
      alert("Você atingiu o limite máximo de fotos");
      event.preventDefault();
      return true;
    }
    return false;
  },
  getAllFiles() {
    const dataTransfer =
      new ClipboardEvent("").clipboardData || new DataTransfer();

    PhotosUpload.files.forEach((file) => dataTransfer.items.add(file));

    return dataTransfer.files;
  },
  getContainer(image) {
    const div = document.createElement("div");
    div.classList.add("photo");
    div.onclick = PhotosUpload.removePhoto;
    div.appendChild(image);
    div.appendChild(PhotosUpload.getRemoveButton());
    return div;
  },
  getRemoveButton() {
    const button = document.createElement("i");
    button.classList.add("material-icons");
    button.innerHTML = "close";
    return button;
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode;
    const newFiles = Array.from(PhotosUpload.preview.children).filter(function (
      file
    ) {
      if (file.classList.contains("photo") && !file.getAttribute("id"))
        return true;
    });

    const index = newFiles.indexOf(photoDiv);

    PhotosUpload.files.splice(index, 1);
    PhotosUpload.updateInputFiles();

    photoDiv.remove();
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode;

    if (photoDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"');

      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`;
      }
    }

    photoDiv.remove();
  },
  updateInputFiles() {
    PhotosUpload.input.files = PhotosUpload.getAllFiles();
  },
};

/* === IMAGE GALLERY === */

const ImageGallery = {
  highlight: document.querySelector(".gallery .highlight > img"),
  previews: document.querySelectorAll(".gallery-preview img"),
  setImage(e) {
    const { target } = e;

    ImageGallery.previews.forEach((preview) =>
      preview.classList.remove("active")
    );
    target.classList.add("active");

    ImageGallery.highlight.src = target.src;
    Lightbox.image.src = target.src;
  },
};

const Lightbox = {
  target: document.querySelector(".lightbox-target"),
  image: document.querySelector(".lightbox-target img"),
  closeButton: document.querySelector(".lightbox-target a.lightbox-close"),
  open() {
    Lightbox.target.style.opacity = 1;
    Lightbox.target.style.top = 0;
    Lightbox.target.style.bottom = 0;
    Lightbox.closeButton.style.top = 0;
  },
  close() {
    Lightbox.target.style.opacity = 0;
    Lightbox.target.style.top = "-100%";
    Lightbox.target.style.bottom = "initial";
    Lightbox.closeButton.style.top = "-80px";
  },
};

/* === VALIDATES === */

const Validate = {
  apply(input, func) {
    Validate.clearErrors(input);

    let results = (input.value = Validate[func](input.value));
    input.value = results.value;

    if (results.error) {
      Validate.displayError(input, results.error);
    }
  },
  displayError(input, error) {
    const div = document.createElement("div");
    div.classList.add("error");
    div.innerHTML = error;
    input.parentNode.appendChild(div);
    input.focus();
  },
  clearErrors(input) {
    const errorDiv = input.parentNode.querySelector(".error");

    if (errorDiv) errorDiv.remove();
  },
  isEmail(value) {
    let error = null;

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!value.match(mailFormat)) {
      error = "Email inválido";
    }

    return {
      error,
      value,
    };
  },
};
