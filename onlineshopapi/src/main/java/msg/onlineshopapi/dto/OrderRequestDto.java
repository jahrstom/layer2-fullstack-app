package msg.onlineshopapi.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequestDto {

    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemRequestDto> items;

    @NotNull(message = "Delivery address is required")
    @Valid
    private AddressDto address;
}
