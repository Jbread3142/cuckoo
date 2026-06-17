const DATA = window.PRODUCT_DATA || {};

const CATEGORY_META = {
  water: {
    label: "정수기",
    eyebrow: "Water Purifier",
    page: "water-purifier.html",
  },
  air: {
    label: "공기청정기",
    eyebrow: "Air Purifier",
    page: "air-purifier.html",
  },
  bidet: {
    label: "비데",
    eyebrow: "Bidet",
    page: "bidet.html",
  },
  pet: {
    label: "펫용품",
    eyebrow: "Pet Care",
    page: "pet.html",
  },
  sleep: {
    label: "매트리스",
    eyebrow: "Sleep Care",
    page: "sleep-care.html",
  },
};

const won = new Intl.NumberFormat("ko-KR");
const menuToggle = document.querySelector(".menu-toggle");
const header = document.querySelector(".site-header");
const detailSection = document.querySelector("#productDetail");
const detailImage = document.querySelector("#detailImage");
const detailName = document.querySelector("#detailName");
const detailModel = document.querySelector("#detailModel");
const detailPrice = document.querySelector("#detailPrice");

function formatPrice(price) {
  return `${won.format(price)}원`;
}

function allProducts() {
  return Object.values(DATA).flat();
}

function productHref(product) {
  return product.id === "888" ? "product-detail.html?id=888" : `#product-${product.id}`;
}

function productCard(product, variant = "best") {
  const original = product.originalPrice
    ? `<small class="original-price">${formatPrice(product.originalPrice)}</small>`
    : "";

  return `
    <article class="product-card ${variant}">
      <a class="product-image" href="${productHref(product)}" aria-label="${product.name} 상세 보기">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </a>
      <div class="product-body">
        <h3>${product.name}</h3>
        <div class="product-price">${formatPrice(product.price)}${original}</div>
      </div>
    </article>
  `;
}

function bestItems(key) {
  return (DATA[key] || []).slice(0, 4);
}

function monthlyItems() {
  return [
    ...(DATA.water || []).slice(0, 2),
    ...(DATA.pet || []).slice(0, 1),
    ...(DATA.sleep || []).slice(0, 1),
  ].slice(0, 4);
}

function renderHome() {
  const sections = {
    waterBest: bestItems("water"),
    airBest: bestItems("air"),
    bidetBest: bestItems("bidet"),
    monthlyBest: monthlyItems(),
  };

  document.querySelectorAll("[data-section]").forEach((target) => {
    const data = sections[target.dataset.section] || [];
    target.innerHTML = data.map((product) => productCard(product, "best")).join("");
  });
}

function renderCategoryPage() {
  const key = document.body.dataset.category;
  if (!key) return;

  const meta = CATEGORY_META[key];
  const products = DATA[key] || [];
  const grid = document.querySelector("[data-product-grid]");
  const count = document.querySelector("[data-product-count]");

  if (grid) {
    grid.innerHTML = products.map((product) => productCard(product, "listing")).join("");
  }
  if (count && meta) {
    count.textContent = `${meta.label} 제품 ${products.length}개를 반영했습니다.`;
  }
}

function renderDetail(product) {
  if (!detailSection || !product) {
    detailSection?.classList.add("hidden");
    return;
  }

  detailImage.src = product.image;
  detailImage.alt = product.name;
  detailName.textContent = product.name;
  detailModel.textContent = product.model ? `모델명 ${product.model}` : product.category;
  detailPrice.textContent = formatPrice(product.price);
  detailSection.classList.remove("hidden");
  detailSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function syncRoute() {
  const match = location.hash.match(/^#product-(.+)$/);
  if (!match) return;
  renderDetail(allProducts().find((product) => product.id === match[1]));
}

menuToggle?.addEventListener("click", () => {
  header.classList.toggle("open");
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".main-nav a")) {
    header.classList.remove("open");
  }
});

window.addEventListener("hashchange", syncRoute);

renderHome();
renderCategoryPage();
syncRoute();
