frappe.provide("frappe.views");

class CustomImageView extends frappe.views.ImageView {

    item_html(item) {
		item._name = encodeURI(item.name);
		const encoded_name = item._name;
		const title = strip_html(item[this.meta.title_field || "name"]);
		const escaped_title = frappe.utils.escape_html(title);
		const _class = !item._image_url ? "no-image" : "";
		const _html = item._image_url
			? `<img data-name="${encoded_name}" src="${item._image_url}" alt="${title}">`
			: `<span class="placeholder-text">
				${frappe.get_abbr(title)}
			</span>`;

		let details = this.item_details_html(item);

		const expand_button_html = item._image_url
			? `<div class="zoom-view" data-name="${encoded_name}">
				${frappe.utils.icon("expand", "xs")}
			</div>`
			: "";

		// ✅ Your custom button HTML
		const custom_button_html = `
		<div class="custom-entry-button">
			<button class="btn btn-xs btn-primary image-entry-action-btn"
				data-name="${item.name}">
				Book Appointment
			</button>
		</div>`;

		return `
			<div class="image-view-item ellipsis">
				<div class="image-view-header">
					<div>
						<input class="level-item list-row-checkbox hidden-xs"
							type="checkbox" data-name="${escape(item.name)}">
						${this.get_like_html(item)}
					</div>
				</span>
				</div>
				<div class="image-view-body ${_class}">
					<a data-name="${encoded_name}"
						title="${encoded_name}"
						href="${this.get_form_link(item)}"
					>
						<div class="image-field"
							data-name="${encoded_name}"
						>
							${_html}
						</div>
					</a>
					${expand_button_html}
				</div>
				<div class="image-view-footer">
					<div class="image-title">
						<span class="ellipsis" title="${escaped_title}">
							<a class="ellipsis" href="${this.get_form_link(item)}"
								title="${escaped_title}" data-doctype="${this.doctype}" data-name="${item.name}">
								${title}
							</a>
						</span>
					</div>
					${details}
					${custom_button_html} <!-- ✅ Injected here -->
				</div>
			</div>
		`;
	}

	render_image_view() {
		var html = this.items.map(this.item_html.bind(this)).join("");

		this.$page.find(".layout-main-section-wrapper").addClass("image-view");

		this.$result.html(`
			<div class="image-view-container">
				${html}
			</div>
		`);

		this.$result.on("click", ".image-entry-action-btn", (e) => {
			e.preventDefault();
			e.stopPropagation();

			let docname = $(e.currentTarget).data("name");

			// 🔁 Perform action per entry
			frappe.msgprint(`Custom action clicked from custom app ${docname}`);

			// You can also call frappe.call or navigate etc.
		});

		this.render_count();
	}
}

frappe.views.ImageView = CustomImageView;