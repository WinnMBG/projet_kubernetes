provider "azurerm" {
  features {}
  subscription_id = "d18efcbe-caa9-4004-ac2c-7312261e11de"
}

resource "azurerm_resource_group" "rgwinn" {
  name     = "wmbouranga-rg"
  location = "West Europe"
}

resource "azurerm_kubernetes_cluster" "rgwinn" {
  name                = "myAKSClusterWinn"
  location            = azurerm_resource_group.rgwinn.location
  resource_group_name = azurerm_resource_group.rgwinn.name
  dns_prefix          = "myaks"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_DS2_v2"
  }

  tags = {
    environment = "Dev"
  }
}

output "kube_config" {
  value = azurerm_kubernetes_cluster.rgwinn.kube_config_raw
}
