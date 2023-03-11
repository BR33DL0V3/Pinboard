let pins = [];

const defaultPins = [
  {
    id: "122203215486581930752615279550",
    image: "https://images.unsplash.com/photo-1580983218765-f663bec07b37?w=600",
    tags: ["engineering"],
  },
  {
    id: "144685389103194178251333634000",
    image: "https://images.unsplash.com/photo-1572932491814-4833690788ad?w=600",
    tags: ["headphones", "ocean", "wellness"],
  },
  {
    id: "159279541173033634211014623228",
    image: "https://images.unsplash.com/photo-1580894908361-967195033215?w=600",
    tags: ["office", "coding", "desk"],
  },
  {
    id: "75261220651273643680893699100",
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600",
    tags: ["boxing", "wellness"],
  },
  {
    id: "161051747537834597427464147310",
    image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600",
    tags: ["lab", "engineering"],
  },
];

const savedPins = localStorage.getItem("savedPins");

if (savedPins) {
  pins = JSON.parse(savedPins);
} else {
  pins = defaultPins;
}

const existingTagsNode = document.querySelector("#existing-tags");
const filterInputNode = document.querySelector("#filter-input");
const pinsListNode = document.querySelector("#pins-list");

const dialogNode = document.querySelector("#dialog");
const dialogStartNode = document.querySelector("#dialog-start");
const dialogFormNode = document.querySelector("#dialog-form");
const dialogImageNode = document.querySelector("#dialog-image");
const dialogTagsNode = document.querySelector("#dialog-tags");
const dialogSubmitNode = document.querySelector("#dialog-submit");

function updateHTML(providedPins) {
  pinsListNode.innerHTML = (providedPins || pins)
    .map(
      ({ id, image, tags }) => `
      <section class="pin">
        <img class="image" src="${image}">

        <ul class="info">
          ${tags
            .map(
              (tag) => `
            <li class="tag-wrap">
              <button class="tag">${tag}</button>
            </li>
          `
            )
            .join("")}
        </ul>
        <button class="remove" aria-label="remove" value="${id}">
          &#10005;
        </button>
      </section>
    `
    )
    .join("");
}

function updatePins(newPins) {
  if (newPins) pins = newPins;
  localStorage.setItem("savedPins", JSON.stringify(pins));
  existingTagsNode.innerHTML = pins
    .reduce((result, { tags }) => {
      const newTags = tags.filter((tag) => !result.includes(tag));
      return [...result, ...newTags];
    }, [])
    .map((tag) => `<option>${tag[0].toUpperCase()}${tag.slice(1)}</option>`)
    .join("");
  updateHTML();
}

function applyFilter(filter) {
  if (filter.trim() === "") return updateHTML();
  const array = filter
    .split(",")
    .map((text) => text.trim())
    .map((text) => text.toLowerCase());
  const filteredPins = pins.filter(({ tags }) => {
    const matchedTags = tags.filter((tag) => array.includes(tag));
    return matchedTags.length >= array.length;
  });
  updateHTML(filteredPins);
}

function handleInput(event) {
  if (event.target === filterInputNode) {
    applyFilter(escape(event.target.value));
  } else if (
    event.target === dialogImageNode ||
    event.target === dialogTagsNode
  ) {
    if (
      dialogImageNode.value.trim() !== "" &&
      dialogTagsNode.value.trim() !== ""
    ) {
      dialogSubmitNode.disabled = false;
    } else {
      dialogSubmitNode.disabled = true;
    }
  }
}

function handleClick(event) {
  if (event.target === dialogStartNode || event.target === dialogNode) {
    dialogNode.classList.toggle("hidden");
    dialogNode.open = !dialogNode.open;
  } else if (event.target.classList.contains("remove")) {
    updatePins(pins.filter(({ id }) => id !== event.target.value));
    applyFilter(filterInputNode.value);
  } else if (event.target.classList.contains("tag")) {
    filterInputNode.value = event.target.innerText;
    applyFilter(filterInputNode.value);
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const time = new Date().getTime();
  const id = `${time}${Math.random() * 100000000000000000}`;
  const image = encodeURI(dialogImageNode.value.trim());
  const tags = dialogTagsNode.value
    .split(",")
    .map((tag) => tag.trim())
    .map((tag) => tag.toLowerCase())
    .map((tag) => escape(tag));
  updatePins([...pins, { id, image, tags }]);
  applyFilter(filterInputNode.value);
  dialogNode.classList.add("hidden");
  dialogNode.open = false;
  dialogImageNode.value = "";
  dialogTagsNode.value = "";
  dialogSubmitNode.disabled = true;
}

document.body.addEventListener("input", handleInput);
document.body.addEventListener("click", handleClick);
document.body.addEventListener("submit", handleSubmit);
updatePins();