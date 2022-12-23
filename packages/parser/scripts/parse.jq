walk(
	if type == "object" then
		{
			BrowseName: .DisplayName,
			DisplayName,
			NodeId,
			NodeClass,
			Type
		} + (
			if .Children then {
				Children
			} else
				null
			end
		) | with_entries(
			.key |= sub(
				"^(?<head>[A-Z])";
				.head | ascii_downcase
			)
		)
	else
		.
	end
)
